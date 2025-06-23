// src/pages/DogManager.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { saveAs } from "file-saver";

function DogManager() {
  const [dogs, setDogs] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingDog, setEditingDog] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [filterText, setFilterText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [importedFile, setImportedFile] = useState(null);
  const itemsPerPage = 9;
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchDogs();
  }, [token]);

  const fetchDogs = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/dogs", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDogs(res.data.results || []);
    } catch (err) {
      console.error("Error fetching dogs:", err);
      setError("Failed to load dogs");
    } finally {
      setLoading(false);
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "animals_upload");

    try {
      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/dxggxpp6so/image/upload",
        formData
      );
      setEditForm((prev) => ({ ...prev, image: res.data.secure_url }));
    } catch (err) {
      console.error("Image upload failed", err);
      setError("Failed to upload image");
    }
  };

  const startEdit = (dog) => {
    setEditingDog(dog._id);
    setEditForm({ ...dog });
  };

  const cancelEdit = () => {
    setEditingDog(null);
    setEditForm({});
  };

  const handleEditSubmit = async () => {
    try {
      await axios.put(`/dogs/${editingDog}`, editForm, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchDogs();
      cancelEdit();
    } catch (err) {
      console.error("Update failed:", err);
      setError("Failed to update dog");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/dogs/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDogs((prev) => prev.filter((d) => d._id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
      setError("Failed to delete dog");
    }
  };

  const handleExportJSON = () => {
    const blob = new Blob([JSON.stringify(dogs, null, 2)], {
      type: "application/json",
    });
    saveAs(blob, "dogs.json");
  };

  const handleExportCSV = () => {
    const headers = Object.keys(dogs[0] || {}).join(",");
    const rows = dogs.map((d) => Object.values(d).join(",")).join("\n");
    const blob = new Blob([`${headers}\n${rows}`], { type: "text/csv" });
    saveAs(blob, "dogs.csv");
  };

  const handleImportChange = (e) => {
    setImportedFile(e.target.files[0]);
  };

  const handleImportSubmit = async () => {
    if (!importedFile) return;
    try {
      const text = await importedFile.text();
      const json = JSON.parse(text);
      for (const dog of json) {
        await axios.post("/dogs", dog, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      fetchDogs();
    } catch (err) {
      console.error("Import failed:", err);
      setError("Failed to import dogs");
    }
  };

  const filteredDogs = dogs.filter((d) =>
    d.name?.toLowerCase().includes(filterText.toLowerCase())
  );

  const totalPages = Math.ceil(filteredDogs.length / itemsPerPage);
  const paginatedDogs = filteredDogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-center mb-6 dark:text-white animate-slideInUp">
        Dog Manager
      </h2>

      <div className="mb-4 flex flex-col md:flex-row items-center gap-4">
        <Input
          type="text"
          placeholder="Search by name..."
          value={filterText}
          onChange={(e) => {
            setFilterText(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full dark:bg-gray-800 dark:text-white"
        />

        <div className="flex gap-2">
          <Button onClick={handleExportJSON} size="sm">Export JSON</Button>
          <Button onClick={handleExportCSV} size="sm" variant="outline">Export CSV</Button>
        </div>
      </div>

      <div className="mb-6 flex flex-col md:flex-row items-center gap-4">
        <Input type="file" accept="application/json" onChange={handleImportChange} />
        <Button onClick={handleImportSubmit}>Import JSON</Button>
      </div>

      {error && <p className="text-center text-red-600 mb-4">{error}</p>}
      {loading ? (
        <p className="text-center dark:text-gray-300">Loading...</p>
      ) : (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginatedDogs.map((dog) => (
              <Card
                key={dog._id}
                className="relative bg-white dark:bg-gray-800 shadow-md transition hover:shadow-lg animate-zoomIn"
              >
                <CardContent className="p-4 space-y-2 text-gray-800 dark:text-gray-100">
                  {editingDog === dog._id ? (
                    <>
                      {["name", "breed", "trainingStatus", "age", "weight", "height", "gender"].map((field) => (
                        <div key={field}>
                          <Label className="capitalize">{field}</Label>
                          <Input
                            name={field}
                            value={editForm[field] || ""}
                            onChange={handleEditChange}
                            className="dark:bg-gray-700"
                          />
                        </div>
                      ))}
                      <Label>Reserved</Label>
                      <select
                        name="reserved"
                        value={editForm.reserved}
                        onChange={handleEditChange}
                        className="w-full border rounded-md p-2 dark:bg-gray-700"
                      >
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                      </select>

                      <Label>Image</Label>
                      <Input type="file" accept="image/*" onChange={handleImageChange} />

                      <div className="flex justify-between pt-2">
                        <Button onClick={handleEditSubmit}>Save</Button>
                        <Button onClick={cancelEdit} variant="outline">Cancel</Button>
                      </div>
                    </>
                  ) : (
                    <>
                      {dog.image && (
                        <img src={dog.image} alt="Dog" className="w-full h-48 object-cover rounded" />
                      )}
                      <p><strong>Name:</strong> {dog.name}</p>
                      <p><strong>Breed:</strong> {dog.breed}</p>
                      <p><strong>Training:</strong> {dog.trainingStatus}</p>
                      <p><strong>Age:</strong> {dog.age}</p>
                      <p><strong>Weight:</strong> {dog.weight} lbs</p>
                      <p><strong>Height:</strong> {dog.height} in</p>
                      <p><strong>Gender:</strong> {dog.gender}</p>
                      <p><strong>Reserved:</strong> {dog.reserved ? "Yes" : "No"}</p>
                      <div className="flex justify-between pt-2">
                        <Button onClick={() => startEdit(dog)} size="sm">Edit</Button>
                        <Button onClick={() => handleDelete(dog._id)} size="sm" variant="destructive">
                          Delete
                        </Button>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center mt-8 gap-4">
              <Button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                variant="outline"
              >
                Prev
              </Button>
              <span className="px-4 py-2 text-sm">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                variant="outline"
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default DogManager;
