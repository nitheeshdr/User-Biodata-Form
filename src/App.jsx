import React, { useState, useEffect } from "react";
import { supabase } from "./lib/supabaseClient";
import { v4 as uuid } from "uuid";

export default function App() {
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    email: "",
    age: "",
    profile_url: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [fetchKey, setFetchKey] = useState("");
  const [userData, setUserData] = useState(null);
  const [message, setMessage] = useState("");

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle file input change
  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  // Upload image to Supabase Storage and get public URL
  const uploadImage = async () => {
    if (!imageFile) return formData.profile_url || null;

    const fileExt = imageFile.name.split(".").pop();
    const fileName = `${uuid()}.${fileExt}`;
    const filePath = fileName;

    // Upload file
    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, imageFile, { upsert: true });

    if (uploadError) {
      alert("Image upload error: " + uploadError.message);
      return null;
    }

    // Get public URL
    const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
    return data.publicUrl;
  };

  // Create new user
  const handleSubmit = async (e) => {
    e.preventDefault();

    const profileUrl = await uploadImage();

    const insertData = {
      username: formData.username,
      name: formData.name,
      email: formData.email,
      age: formData.age ? Number(formData.age) : null,
      profile_url: profileUrl || "",
    };

    const { error } = await supabase.from("users").insert([insertData]);

    if (error) {
      alert("Insert error: " + error.message);
    } else {
      alert("User created!");
      setFormData({ username: "", name: "", email: "", age: "", profile_url: "" });
      setImageFile(null);
      setUserData(null);
    }
  };

  // Fetch user by username or email
  const fetchUser = async () => {
    if (!fetchKey.trim()) {
      setMessage("Please enter username or email to fetch");
      return;
    }
    setMessage("Fetching...");
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .or(`email.eq.${fetchKey},username.eq.${fetchKey}`)
      .single();

    if (error || !data) {
      setUserData(null);
      setMessage("User not found");
      setFormData({ username: "", name: "", email: "", age: "", profile_url: "" });
    } else {
      setUserData(data);
      setFormData({
        username: data.username || "",
        name: data.name || "",
        email: data.email || "",
        age: data.age?.toString() || "",
        profile_url: data.profile_url || "",
      });
      setMessage("");
      setImageFile(null);
    }
  };

  // Update existing user by email (unique)
  const updateUser = async () => {
    if (!formData.email) {
      alert("Email is required to update user");
      return;
    }
    const profileUrl = await uploadImage();

    const updateData = {
      username: formData.username,
      name: formData.name,
      age: formData.age ? Number(formData.age) : null,
      profile_url: profileUrl || formData.profile_url || "",
    };

    const { error } = await supabase
      .from("users")
      .update(updateData)
      .eq("email", formData.email);

    if (error) {
      alert("Update failed: " + error.message);
    } else {
      alert("User updated!");
      fetchUser(); // Refresh data to reflect updates
      setImageFile(null);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">User Biodata Form</h1>

      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow">
        <input
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="Username"
          required
          className="w-full border p-2 rounded"
        />
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Name"
          className="w-full border p-2 rounded"
        />
        <input
          name="email"
          value={formData.email}
          onChange={handleChange}
          type="email"
          placeholder="Email"
          required
          className="w-full border p-2 rounded"
        />
        <input
          name="age"
          type="number"
          min="0"
          value={formData.age}
          onChange={handleChange}
          placeholder="Age"
          className="w-full border p-2 rounded"
        />

        <label className="block">
          <span className="text-gray-700">Profile Image (optional)</span>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="mt-1"
          />
        </label>

        {/* Show image preview */}
        {imageFile ? (
          <img
            src={URL.createObjectURL(imageFile)}
            alt="Preview"
            className="w-24 h-24 rounded-full mt-2 mx-auto"
          />
        ) : formData.profile_url ? (
          <img
            src={formData.profile_url}
            alt="Profile"
            className="w-24 h-24 rounded-full mt-2 mx-auto"
          />
        ) : null}

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded w-full"
        >
          Create User
        </button>
      </form>

      {/* Fetch user */}
      <div className="mt-8 bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Fetch User by Username or Email</h2>
        <input
          type="text"
          value={fetchKey}
          onChange={(e) => setFetchKey(e.target.value)}
          placeholder="Enter username or email"
          className="w-full border p-2 rounded mb-3"
        />
        <button
          onClick={fetchUser}
          className="bg-green-600 text-white px-4 py-2 rounded w-full"
        >
          Fetch User
        </button>
        {message && <p className="mt-3 text-center text-gray-600">{message}</p>}

        {/* Show user details and edit option */}
        {userData && (
          <div className="mt-6 border-t pt-4 space-y-3">
            <h3 className="text-lg font-semibold">Edit User</h3>

            <input
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Username"
              className="w-full border p-2 rounded"
            />
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Name"
              className="w-full border p-2 rounded"
            />
            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              type="email"
              placeholder="Email"
              className="w-full border p-2 rounded"
              disabled
            />
            <input
              name="age"
              type="number"
              min="0"
              value={formData.age}
              onChange={handleChange}
              placeholder="Age"
              className="w-full border p-2 rounded"
            />

            <label className="block">
              <span className="text-gray-700">Change Profile Image (optional)</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="mt-1"
              />
            </label>

            {imageFile ? (
              <img
                src={URL.createObjectURL(imageFile)}
                alt="Preview"
                className="w-24 h-24 rounded-full mt-2 mx-auto"
              />
            ) : formData.profile_url ? (
              <img
                src={formData.profile_url}
                alt="Profile"
                className="w-24 h-24 rounded-full mt-2 mx-auto"
              />
            ) : null}

            <button
              onClick={updateUser}
              className="bg-yellow-500 text-white px-4 py-2 rounded w-full"
            >
              Update User
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
