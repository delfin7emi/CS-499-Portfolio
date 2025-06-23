// src/components/MonkeyManager.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { saveAs } from "file-saver";

function MonkeyManager() {
  const [monkeys, setMonkeys] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingMonkey, setEditingMonkey] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [filterText, setFilterText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [importedFile, setImportedFile] = useState(null);
  const itemsPerPage = 9;
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchMonkeys();
    loadCloudinaryWidget();
  }, [token]);

  const fetchMonkeys = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/monkeys", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMonkeys(res.data.results || []);
    } catch (err) {
      console.error("Error fetching monkeys:", err);
      setError("Failed to load monkeys");
    } finally {
      setLoading(false);
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const loadCloudinaryWidget = () => {
    if (!window.cloudinary) return;
    window.cloudinary.createUploadWidget(
      {
        cloudName: "dxggxp6so", // Your Cloudinary cloud name
        uploadPreset: "monkey_upload"
      },
      (error, result) => {
        if (!error && result && result.event === "success") {
          setEditForm((prev) => ({ ...prev, image: result.info.secure_url }));
        }
      }
    ).open();
  };

  const startEdit = (monkey) => {
    setEditingMonkey(monkey._id);
    setEditForm({ ...monkey });
  };

  const cancelEdit = () => {
    setEditingMonkey(null);
    setEditForm({});
  };

  const handleEditSubmit = async () => {
    try {
      await axios.put(`/monkeys/${editingMonkey}`, editForm, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchMonkeys();
      cancelEdit();
    } catch (err) {
      console.error("Update failed:", err);
      setError("Failed to update monkey");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/monkeys/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMonkeys((prev) => prev.filter((m) => m._id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
      setError("Failed to delete monkey");
    }
  };

  const handleExportJSON = () => {
    const blob = new Blob([JSON.stringify(monkeys, null, 2)], {
      type: "application/json",
    });
    saveAs(blob, "monkeys.json");
  };

  const handleExportCSV = () => {
    const headers = Object.keys(monkeys[0] || {}).join(",");
    const rows = monkeys.map((m) => Object.values(m).join(",")).join("\n");
    const blob = new Blob([`${headers}\n${rows}`], { type: "text/csv" });
    saveAs(blob, "monkeys.csv");
  };

  const handleImportChange = (e) => {
    setImportedFile(e.target.files[0]);
  };

  const handleImportSubmit = async () => {
    if (!importedFile) return;
    try {
      const text = await importedFile.text();
      const json = JSON.parse(text);
      for (const monkey of json) {
        await axios.post("/monkeys", monkey, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      fetchMonkeys();
    } catch (err) {
      console.error("Import failed:", err);
      setError("Failed to import monkeys");
    }
  };

  const filteredMonkeys = monkeys.filter((m) =>
    m.name.toLowerCase().includes(filterText.toLowerCase())
  );

  const totalPages = Math.ceil(filteredMonkeys.length / itemsPerPage);
  const paginatedMonkeys = filteredMonkeys.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-center mb-6 dark:text-white animate-slideInUp">
        Monkey Manager
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
            {paginatedMonkeys.map((monkey) => (
              <Card
                key={monkey._id}
                className="relative bg-white dark:bg-gray-800 shadow-md transition hover:shadow-lg animate-zoomIn"
              >
                <CardContent className="p-4 space-y-2 text-gray-800 dark:text-gray-100">
                  {editingMonkey === monkey._id ? (
                    <>
                      {["name","species","trainingStatus","age","weight","height","tailLength","gender"].map((field) => (
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
                      <Button type="button" onClick={loadCloudinaryWidget}>Upload Image</Button>

                      <div className="flex justify-between pt-2">
                        <Button onClick={handleEditSubmit}>Save</Button>
                        <Button onClick={cancelEdit} variant="outline">Cancel</Button>
                      </div>
                    </>
                  ) : (
                    <>
                      {monkey.image && (
                        <img src={monkey.image} alt="Monkey" className="w-full h-48 object-cover rounded" />
                      )}
                      <p><strong>Name:</strong> {monkey.name}</p>
                      <p><strong>Species:</strong> {monkey.species}</p>
                      <p><strong>Training:</strong> {monkey.trainingStatus}</p>
                      <p><strong>Age:</strong> {monkey.age}</p>
                      <p><strong>Weight:</strong> {monkey.weight} lbs</p>
                      <p><strong>Height:</strong> {monkey.height} in</p>
                      <p><strong>Tail Length:</strong> {monkey.tailLength} in</p>
                      <p><strong>Gender:</strong> {monkey.gender}</p>
                      <p><strong>Reserved:</strong> {monkey.reserved ? "Yes" : "No"}</p>
                      <div className="flex justify-between pt-2">
                        <Button onClick={() => startEdit(monkey)} size="sm">Edit</Button>
                        <Button onClick={() => handleDelete(monkey._id)} size="sm" variant="destructive">
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

export default MonkeyManager;
