"use client";
import { useState } from "react";
import { comics as initialComics } from "../data/comics";
import Link from "next/link";
import Image from "next/image";

export default function Dashboard() {
  const [comics, setComics] = useState(initialComics);
  const [editingComic, setEditingComic] = useState(null);
  const [activeTab, setActiveTab] = useState("list"); // 'list' or 'form'
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    thumbnail: "",
    releaseDate: "",
    tags: [],
    pages: [""],
    rating: 5.0,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "pages" ? value.split(",").map((url) => url.trim()) : value,
    }));
  };

  const handleTagsChange = (e) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      tags: value.split(",").map((tag) => tag.trim()),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingComic) {
      setComics((prev) => ({
        ...prev,
        [editingComic]: { ...formData },
      }));
    } else {
      const newId = Math.max(...Object.keys(comics).map(Number), 0) + 1;
      setComics((prev) => ({
        ...prev,
        [newId]: { ...formData },
      }));
    }
    resetForm();
    setActiveTab("list");
  };

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this comic?")) {
      const newComics = { ...comics };
      delete newComics[id];
      setComics(newComics);
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
      releaseDate: "",
      tags: [],
      pages: [""],
      rating: 5.0,
    });
  };

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
          <p className="text-3xl font-bold">{Object.keys(comics).length}</p>
        </div>
        <div className="retro-card p-6">
          <h3 className="text-lg mb-2">Latest Issue</h3>
          <p className="text-3xl font-bold">
            #{Math.max(...Object.keys(comics).map(Number))}
          </p>
        </div>
        <div className="retro-card p-6">
          <h3 className="text-lg mb-2">Average Rating</h3>
          <p className="text-3xl font-bold">
            {(
              Object.values(comics).reduce(
                (acc, comic) => acc + (comic.rating || 0),
                0
              ) / Object.keys(comics).length
            ).toFixed(1)}
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
                <label className="block mb-2">Thumbnail URL</label>
                <input
                  type="url"
                  name="thumbnail"
                  value={formData.thumbnail}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded bg-[var(--color-background)] text-[var(--color-text)]"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2">Release Date</label>
                  <input
                    type="date"
                    name="releaseDate"
                    value={formData.releaseDate}
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
                <div className="relative aspect-[2/3] mb-4">
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
          {Object.entries(comics).map(([id, comic]) => (
            <div key={id} className="retro-card p-4">
              <div className="relative aspect-[2/3] mb-4">
                <Image
                  src={comic.thumbnail || "/placeholder-comic.jpg"}
                  alt={comic.title}
                  fill
                  className="object-cover rounded"
                />
              </div>
              <h3 className="text-xl font-bold mb-2">{comic.title}</h3>
              <p className="text-sm mb-2">Issue #{id}</p>
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
                  onClick={() => handleEdit(id)}
                  className="retro-button text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(id)}
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
