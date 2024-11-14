"use client";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import Link from "next/link";
import Image from "next/image";

export default function Dashboard() {
  const [comics, setComics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingComic, setEditingComic] = useState(null);
  const [activeTab, setActiveTab] = useState("list");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    thumbnail: "",
    release_date: "",
    tags: [],
    pages: [],
    rating: 5.0,
  });

  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterTag, setFilterTag] = useState("");
  const [sortBy, setSortBy] = useState("newest"); // "newest", "oldest", "rating"

  const [draggedIndex, setDraggedIndex] = useState(null);
  const [draggedOverIndex, setDraggedOverIndex] = useState(null);

  useEffect(() => {
    fetchComics().finally(() => setLoading(false));
  }, []);

  const fetchComics = async () => {
    const { data, error } = await supabase
      .from("comics")
      .select("*")
      .order("release_date", { ascending: false });

    if (error) {
      console.error("Error fetching comics:", error);
      return;
    }

    setComics(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const comicData = {
      ...formData,
      tags: Array.isArray(formData.tags)
        ? formData.tags
        : formData.tags.split(",").map((t) => t.trim()),
      pages: Array.isArray(formData.pages)
        ? formData.pages
        : formData.pages.split(",").map((p) => p.trim()),
    };

    if (editingComic) {
      const { error } = await supabase
        .from("comics")
        .update(comicData)
        .eq("id", editingComic);

      if (error) {
        console.error("Error updating comic:", error);
        return;
      }
    } else {
      const { error } = await supabase.from("comics").insert([comicData]);

      if (error) {
        console.error("Error creating comic:", error);
        return;
      }
    }

    fetchComics();
    resetForm();
    setActiveTab("list");
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this comic?")) {
      const { error } = await supabase.from("comics").delete().eq("id", id);

      if (error) {
        console.error("Error deleting comic:", error);
        return;
      }

      fetchComics();
    }
  };

  const handleEdit = (id) => {
    setEditingComic(id);
    const comicToEdit = comics.find((comic) => comic.id === id);
    if (comicToEdit) {
      setFormData({
        title: comicToEdit.title,
        description: comicToEdit.description,
        thumbnail: comicToEdit.thumbnail || "",
        release_date: comicToEdit.release_date,
        tags: comicToEdit.tags || [],
        pages: Array.isArray(comicToEdit.pages) ? comicToEdit.pages : [],
        rating: comicToEdit.rating || 5.0,
      });
      setActiveTab("form");
    } else {
      console.error("Comic not found");
      alert("Error: Comic not found");
    }
  };

  const resetForm = () => {
    setEditingComic(null);
    setFormData({
      title: "",
      description: "",
      thumbnail: "",
      release_date: "",
      tags: [],
      pages: [],
      rating: 5.0,
    });
  };

  const uploadThumbnail = async (file) => {
    try {
      setUploading(true);

      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}-${Date.now()}.${fileExt}`;
      const filePath = `thumbnails/${fileName}`;

      const { error: uploadError, data } = await supabase.storage
        .from("comics")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
          contentType: file.type,
        });

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("comics").getPublicUrl(filePath);

      setFormData((prev) => ({
        ...prev,
        thumbnail: publicUrl,
      }));
    } catch (error) {
      console.error("Error uploading thumbnail:", error.message);
      alert(`Error uploading thumbnail: ${error.message}`);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const uploadPages = async (files) => {
    try {
      setUploading(true);
      const uploadedPages = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileExt = file.name.split(".").pop();
        const fileName = `${Math.random()}-${Date.now()}.${fileExt}`;
        const filePath = `pages/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("comics")
          .upload(filePath, file, {
            cacheControl: "3600",
            upsert: false,
            contentType: file.type,
          });

        if (uploadError) throw uploadError;

        const {
          data: { publicUrl },
        } = supabase.storage.from("comics").getPublicUrl(filePath);

        uploadedPages.push(publicUrl);
        setUploadProgress(((i + 1) / files.length) * 100);
      }

      setFormData((prev) => ({
        ...prev,
        pages: [...prev.pages, ...uploadedPages],
      }));
    } catch (error) {
      console.error("Error uploading pages:", error.message);
      alert(`Error uploading pages: ${error.message}`);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const removePage = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      pages: prev.pages.filter((_, index) => index !== indexToRemove),
    }));
  };

  const reorderPages = (dragIndex, dropIndex) => {
    setFormData((prev) => {
      const newPages = [...prev.pages];
      const [draggedPage] = newPages.splice(dragIndex, 1);
      newPages.splice(dropIndex, 0, draggedPage);
      return { ...prev, pages: newPages };
    });
  };

  const handleFileChange = async (e, type) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (type === "thumbnail") {
      await uploadThumbnail(files[0]);
    } else if (type === "pages") {
      await uploadPages(files);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "pages"
          ? value.split(",").map((p) => p.trim())
          : name === "rating"
          ? parseFloat(value)
          : value,
    }));
  };

  const handleTagsChange = (e) => {
    const tagsString = e.target.value;
    const tagsArray = tagsString
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

    setFormData((prev) => ({
      ...prev,
      tags: tagsArray,
    }));
  };

  const getFilteredComics = () => {
    return comics
      .filter((comic) => {
        const matchesSearch =
          comic.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          comic.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesTag = filterTag === "" || comic.tags.includes(filterTag);
        return matchesSearch && matchesTag;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "oldest":
            return new Date(a.release_date) - new Date(b.release_date);
          case "rating":
            return b.rating - a.rating;
          case "newest":
          default:
            return new Date(b.release_date) - new Date(a.release_date);
        }
      });
  };

  const getAllTags = () => {
    const tags = new Set();
    comics.forEach((comic) => {
      comic.tags.forEach((tag) => tags.add(tag));
    });
    return Array.from(tags);
  };

  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.setData("text/plain", index);
    e.target.classList.add("dragging");

    // Create a drag image (optional)
    const dragImage = e.target.cloneNode(true);
    dragImage.style.opacity = "0.5";
    dragImage.style.position = "absolute";
    dragImage.style.top = "-1000px";
    document.body.appendChild(dragImage);
    e.dataTransfer.setDragImage(dragImage, 0, 0);
    setTimeout(() => document.body.removeChild(dragImage), 0);
  };

  const handleDragEnd = (e) => {
    e.target.classList.remove("dragging");
    setDraggedIndex(null);
    setDraggedOverIndex(null);
    document.querySelectorAll(".drag-over").forEach((el) => {
      el.classList.remove("drag-over");
    });
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    setDraggedOverIndex(index);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.target.closest(".page-item").classList.remove("drag-over");
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.target.closest(".page-item").classList.add("drag-over");
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    const dragIndex = parseInt(e.dataTransfer.getData("text/plain"));

    if (dragIndex !== dropIndex) {
      const newPages = [...formData.pages];
      const [draggedPage] = newPages.splice(dragIndex, 1);
      newPages.splice(dropIndex, 0, draggedPage);

      setFormData((prev) => ({
        ...prev,
        pages: newPages,
      }));
    }

    setDraggedIndex(null);
    setDraggedOverIndex(null);
    e.target.closest(".page-item").classList.remove("drag-over");
  };

  const getIssueNumber = (comics, currentId) => {
    // Sort comics by release date, oldest first
    const sortedComics = [...comics].sort(
      (a, b) => new Date(a.release_date) - new Date(b.release_date)
    );
    // Find the index of current comic and add 1 for human-readable issue number
    // Oldest comic will be index 0 + 1 = #1
    return sortedComics.findIndex((comic) => comic.id === currentId) + 1;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="retro-card p-8 text-center">
          <p className="text-[var(--color-text)] text-xl">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="retro-title text-4xl mb-2">Comics Dashboard</h1>
          <p className="text-[var(--color-text)] opacity-80">
            Manage your comic collection
          </p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => {
              resetForm();
              setActiveTab("form");
            }}
            className="retro-button"
          >
            Add New Comic
          </button>
          <Link href="/" className="retro-button">
            Back to Home
          </Link>
        </div>
      </div>

      {/* Stats Overview - Now 4 columns */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="retro-card p-6">
          <h3 className="text-lg mb-2">Total Comics</h3>
          <p className="text-3xl font-bold">{comics.length}</p>
        </div>
        <div className="retro-card p-6">
          <h3 className="text-lg mb-2">Latest Issue</h3>
          <p className="text-3xl font-bold">
            #
            {comics.length > 0
              ? getIssueNumber(
                  comics,
                  comics.sort(
                    (a, b) =>
                      new Date(b.release_date) - new Date(a.release_date)
                  )[0].id
                )
              : 0}
          </p>
        </div>
        <div className="retro-card p-6">
          <h3 className="text-lg mb-2">Average Rating</h3>
          <p className="text-3xl font-bold">
            {comics.length > 0
              ? (
                  comics.reduce((acc, comic) => acc + comic.rating, 0) /
                  comics.length
                ).toFixed(1)
              : "0.0"}
          </p>
        </div>
        <div className="retro-card p-6">
          <h3 className="text-lg mb-2">Total Tags</h3>
          <p className="text-3xl font-bold">{getAllTags().length}</p>
        </div>
      </div>

      {activeTab === "form" ? (
        /* Add/Edit Comic Form */
        <div className="retro-card p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl">
              {editingComic ? `Edit Comic #${editingComic}` : "Add New Comic"}
            </h2>
            <button
              onClick={() => setActiveTab("list")}
              className="retro-button"
            >
              Back to List
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-2">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded bg-[var(--color-background)] text-[var(--color-text)]"
                  required
                />
              </div>
              <div>
                <label className="block mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full p-2 border rounded bg-[var(--color-background)] text-[var(--color-text)]"
                  required
                />
              </div>
              <div>
                <label className="block mb-2">Thumbnail</label>
                <div className="flex gap-4 items-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, "thumbnail")}
                    className="w-full p-2 border rounded bg-[var(--color-background)] text-[var(--color-text)]"
                  />
                  {formData.thumbnail && (
                    <div className="w-16 h-16 relative">
                      <Image
                        src={formData.thumbnail}
                        alt="Thumbnail preview"
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                  )}
                </div>
              </div>
              <div>
                <label className="block mb-2">Comic Pages</label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => handleFileChange(e, "pages")}
                  className="w-full p-2 border rounded bg-[var(--color-background)] text-[var(--color-text)]"
                />
                {uploading && (
                  <div className="mt-2">
                    <div className="h-2 bg-gray-200 rounded">
                      <div
                        className="h-full bg-[var(--color-primary)] rounded"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                  </div>
                )}
                {formData.pages.length > 0 && (
                  <div className="mt-4">
                    <h4 className="mb-2">Uploaded Pages (drag to reorder)</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {formData.pages.map((pageUrl, index) => (
                        <div
                          key={index}
                          className={`
                            page-item relative group cursor-move transform transition-all duration-200
                            ${
                              draggedIndex === index
                                ? "scale-105 opacity-50"
                                : ""
                            }
                            ${draggedOverIndex === index ? "scale-105" : ""}
                          `}
                          draggable="true"
                          onDragStart={(e) => handleDragStart(e, index)}
                          onDragEnd={handleDragEnd}
                          onDragOver={(e) => handleDragOver(e, index)}
                          onDragEnter={handleDragEnter}
                          onDragLeave={handleDragLeave}
                          onDrop={(e) => handleDrop(e, index)}
                        >
                          <div className="relative aspect-square rounded-lg overflow-hidden shadow-lg transition-transform duration-200">
                            {pageUrl && (
                              <Image
                                src={pageUrl}
                                alt={`Page ${index + 1}`}
                                fill
                                className="object-cover rounded-lg"
                              />
                            )}
                            <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent">
                              <div className="p-2 text-white text-sm font-medium">
                                Page {index + 1}
                              </div>
                            </div>
                            <div className="absolute inset-0 border-2 border-dashed border-transparent transition-colors duration-200 rounded-lg drag-outline"></div>
                          </div>
                          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <button
                              type="button"
                              onClick={() => removePage(index)}
                              className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors duration-200 shadow-lg"
                            >
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2">Release Date</label>
                  <input
                    type="date"
                    name="release_date"
                    value={formData.release_date}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded bg-[var(--color-background)] text-[var(--color-text)]"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2">Rating</label>
                  <input
                    type="number"
                    name="rating"
                    min="0"
                    max="5"
                    step="0.1"
                    value={formData.rating}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded bg-[var(--color-background)] text-[var(--color-text)]"
                  />
                </div>
              </div>
              <div>
                <label className="block mb-2">Tags</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-[var(--color-primary)] text-white rounded text-xs flex items-center gap-2"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => {
                          setFormData((prev) => ({
                            ...prev,
                            tags: prev.tags.filter((_, i) => i !== index),
                          }));
                        }}
                        className="hover:text-red-300"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <input
                  type="text"
                  placeholder="Type a tag and press Enter"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      const newTag = e.target.value.trim();
                      if (newTag && !formData.tags.includes(newTag)) {
                        setFormData((prev) => ({
                          ...prev,
                          tags: [...prev.tags, newTag],
                        }));
                        e.target.value = "";
                      }
                    }
                  }}
                  className="w-full p-2 border rounded bg-[var(--color-background)] text-[var(--color-text)]"
                />
              </div>
              <div className="flex gap-4">
                <button type="submit" className="retro-button">
                  {editingComic ? "Update Comic" : "Add Comic"}
                </button>
                {editingComic && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="retro-button"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>

            {/* Preview Panel */}
            <div className="space-y-4">
              <h3 className="text-xl mb-4">Preview</h3>
              <div className="retro-card p-4">
                <div className="relative aspect-square mb-4">
                  {formData.thumbnail && (
                    <Image
                      src={formData.thumbnail}
                      alt="Preview"
                      fill
                      className="object-cover rounded"
                    />
                  )}
                </div>
                <h4 className="text-xl font-bold mb-2">
                  {formData.title || "Comic Title"}
                </h4>
                <p className="text-sm mb-2">
                  {formData.description || "Comic description will appear here"}
                </p>
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-[var(--color-primary)] text-white rounded text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Add Filter Section */}
          <div className="retro-card p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block mb-2">Search Comics</label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by title or description..."
                  className="w-full p-2 border rounded bg-[var(--color-background)] text-[var(--color-text)]"
                />
              </div>
              <div>
                <label className="block mb-2">Filter by Tag</label>
                <select
                  value={filterTag}
                  onChange={(e) => setFilterTag(e.target.value)}
                  className="w-full p-2 border rounded bg-[var(--color-background)] text-[var(--color-text)]"
                >
                  <option value="">All Tags</option>
                  {getAllTags().map((tag) => (
                    <option key={tag} value={tag}>
                      {tag}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block mb-2">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full p-2 border rounded bg-[var(--color-background)] text-[var(--color-text)]"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="rating">Highest Rating</option>
                </select>
              </div>
            </div>
          </div>

          {/* Modify the Comics List to use filtered results */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {getFilteredComics().map((comic) => (
              <div key={comic.id} className="retro-card p-4">
                <div className="relative aspect-square mb-4">
                  <Image
                    src={comic.thumbnail || "/placeholder-comic.jpg"}
                    alt={comic.title}
                    fill
                    className="object-cover rounded"
                  />
                </div>
                <h3 className="text-xl font-bold mb-2">{comic.title}</h3>
                <p className="text-sm mb-2">
                  Issue #{getIssueNumber(comics, comic.id)}
                </p>
                <p className="text-sm mb-4 line-clamp-2">{comic.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {comic.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-[var(--color-primary)] text-white rounded text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(comic.id)}
                    className="retro-button text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(comic.id)}
                    className="retro-button text-sm bg-red-500 hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Add No Results Message */}
          {getFilteredComics().length === 0 && (
            <div className="text-center py-8">
              <p className="text-[var(--color-text)] text-xl">
                No comics found matching your search criteria
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
