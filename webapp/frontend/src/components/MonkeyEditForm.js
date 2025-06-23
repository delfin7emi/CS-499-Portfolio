// src/components/MonkeyEditForm.js
import React, { useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

function MonkeyEditForm({ monkey, onUpdate, onCancel }) {
  const [formData, setFormData] = useState({ ...monkey });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(`/monkeys/${monkey._id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onUpdate(res.data); // Notify parent of update
    } catch (err) {
      setError(err.response?.data?.error || "Update failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded-xl shadow">
      <h3 className="text-lg font-semibold">Edit Monkey</h3>

      {[
        "name",
        "species",
        "trainingStatus",
        "age",
        "weight",
        "height",
        "tailLength",
        "gender",
      ].map((field) => (
        <div key={field}>
          <Label htmlFor={field}>{field.charAt(0).toUpperCase() + field.slice(1)}</Label>
          <Input
            id={field}
            name={field}
            value={formData[field] || ""}
            onChange={handleChange}
          />
        </div>
      ))}

      <div>
        <Label htmlFor="reserved">Reserved</Label>
        <select
          id="reserved"
          name="reserved"
          value={formData.reserved}
          onChange={handleChange}
          className="w-full border rounded p-2"
        >
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <div className="flex justify-end gap-2">
        <Button type="button" onClick={onCancel} variant="outline">
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}

export default MonkeyEditForm;
