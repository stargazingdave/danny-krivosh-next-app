'use client';

import { useState, FormEvent } from 'react';
import { uploadFullSongClient } from '../../functions/uploadFullSongClient';

interface AddSongFormProps {
  onUpload?: () => void;
}

export default function AddSongForm({ onUpload }: AddSongFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [genres, setGenres] = useState('');
  const [definition, setDefinition] = useState<'hd' | '-'>('hd');
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [lyrics, setLyrics] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title || !audioFile || !imageFile) {
      alert('Title, audio, and image are required');
      return;
    }

    setSubmitting(true);
    try {
      await uploadFullSongClient({
        title,
        description,
        genres,
        definition,
        lyrics,
        audioFile,
        imageFile,
      });

      alert('Song added!');
      onUpload?.();
    } catch (error) {
      console.error('Error uploading song:', error);
      alert('Failed to add song');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-white">
      {/* Title */}
      <div>
        <label className="block text-sm mb-1">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="w-full px-4 py-2 border border-white/20 rounded bg-white/10 focus:outline-none focus:ring focus:ring-amber-700"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm mb-1">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          className="w-full px-4 py-2 border border-white/20 rounded bg-white/10 resize-none focus:outline-none focus:ring focus:ring-amber-700"
        />
      </div>

      {/* Genres */}
      <div>
        <label className="block text-sm mb-1">Genres (comma separated)</label>
        <input
          type="text"
          value={genres}
          onChange={(e) => setGenres(e.target.value)}
          placeholder="e.g. rock, pop"
          className="w-full px-4 py-2 border border-white/20 rounded bg-white/10 focus:outline-none focus:ring focus:ring-amber-700"
        />
      </div>

      {/* Definition */}
      <div>
        <label className="block text-sm mb-1">HD</label>
        <select
          value={definition}
          onChange={(e) => setDefinition(e.target.value as 'hd' | '-')}
          className="w-full px-4 py-2 border border-white/20 rounded bg-white/10 focus:outline-none focus:ring focus:ring-amber-700"
        >
          <option className='bg-black/80 text-white' value="hd">HD</option>
          <option className='bg-black/80 text-white' value="-">-</option>
        </select>
      </div>

      {/* Lyrics */}
      <div>
        <label className="block text-sm mb-1">Lyrics</label>
        <textarea
          value={lyrics}
          onChange={(e) => setLyrics(e.target.value)}
          placeholder="lyrics (optional)"
          rows={10}
          className="w-full px-4 py-2 border border-white/20 rounded bg-white/10 resize-y focus:outline-none focus:ring focus:ring-amber-700"
        />
      </div>

      {/* Files */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm mb-1">Audio File *</label>
          <input
            type="file"
            accept="audio/*"
            onChange={(e) => setAudioFile(e.target.files?.[0] || null)}
            className="block w-full text-sm text-white bg-white/10 rounded file:bg-amber-800 file:text-white file:border-0 file:px-3 file:py-1.5 file:rounded hover:file:bg-amber-700 cursor-pointer"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Image *</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
            className="block w-full text-sm text-white bg-white/10 rounded file:bg-amber-800 file:text-white file:border-0 file:px-3 file:py-1.5 file:rounded hover:file:bg-amber-700 cursor-pointer"
          />
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="bg-amber-800 px-6 py-2 rounded text-white hover:bg-amber-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={submitting}
      >
        {submitting && <LoadingSpinner />}
        Add Song
      </button>
    </form>
  );
}

const LoadingSpinner = () => (
  <svg
    className="animate-spin h-5 w-5 mr-3 inline-block text-white"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      fill="none"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
    />
  </svg>
);
