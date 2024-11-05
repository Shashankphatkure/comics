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
    setFormData(comics[id]);
    setActiveTab("form");
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
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `thumbnails/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("comics")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
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
      console.error("Error uploading thumbnail:", error);
      alert("Error uploading thumbnail!");
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const uploadPages = async (files) => {
    try {
      setUploading(true);
      const uploadPromises = [];
      const uploadedUrls = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileExt = file.name.split(".").pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `pages/${fileName}`;

        const uploadPromise = supabase.storage
          .from("comics")
          .upload(filePath, file, {
            cacheControl: "3600",
            upsert: false,
          })
          .then(({ error }) => {
            if (error) throw error;
            const {
              data: { publicUrl },
            } = supabase.storage.from("comics").getPublicUrl(filePath);
            uploadedUrls.push(publicUrl);
            setUploadProgress(((i + 1) / files.length) * 100);
          });

        uploadPromises.push(uploadPromise);
      }

      await Promise.all(uploadPromises);

      setFormData((prev) => ({
        ...prev,
        pages: uploadedUrls,
      }));
    } catch (error) {
      console.error("Error uploading pages:", error);
      alert("Error uploading pages!");
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
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
    setFormData((prev) => ({
      ...prev,
      tags: tagsString
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag),
    }));
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

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="retro-card p-6">
          <h3 className="text-lg mb-2">Total Comics</h3>
          <p className="text-3xl font-bold">{comics.length}</p>
        </div>
        <div className="retro-card p-6">
          <h3 className="text-lg mb-2">Latest Issue</h3>
          <p className="text-3xl font-bold">
            #{comics.length > 0 ? comics[comics.length - 1].id : 0}
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
                  <div className="mt-2 grid grid-cols-4 gap-2">
                    {formData.pages.map((url, index) => (
                      <div key={index} className="relative aspect-square">
                        <Image
                          src={url}
                          alt={`Page ${index + 1}`}
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                    ))}
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
                <label className="block mb-2">Tags (comma-separated)</label>
                <input
                  type="text"
                  value={formData.tags.join(", ")}
                  onChange={handleTagsChange}
                  className="w-full p-2 border rounded bg-[var(--color-background)] text-[var(--color-text)]"
                />
              </div>
              <div>
                <label className="block mb-2">
                  Pages URLs (comma-separated)
                </label>
                <textarea
                  name="pages"
                  value={formData.pages.join(", ")}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full p-2 border rounded bg-[var(--color-background)] text-[var(--color-text)]"
                  required
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
        /* Comics List */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {comics.map((comic) => (
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
              <p className="text-sm mb-2">Issue #{comic.id}</p>
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
      )}
    </div>
  );
}
