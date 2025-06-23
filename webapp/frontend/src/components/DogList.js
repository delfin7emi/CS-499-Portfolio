// src/components/DogList.js

import React, { useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

function DogList({ dogs }) {
  const [editDogId, setEditDogId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [dogList, setDogList] = useState(dogs);
  const [error, setError] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const token = localStorage.getItem("token");

  const handleEditClick = (dog) => {
    setEditDogId(dog._id);
    setEditForm({ ...dog });
  };

  const cancelEdit = () => {
    setEditDogId(null);
    setEditForm({});
  };

  const handleInputChange = (e) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleEditSubmit = async () => {
    try {
      const res = await axios.put(`/dogs/${editDogId}`, editForm, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const updatedDog = res.data;
      setDogList((prev) =>
        prev.map((dog) => (dog._id === editDogId ? updatedDog : dog))
      );
      cancelEdit();
    } catch (err) {
      setError("Failed to update dog.");
      console.error(err);
    }
  };

  const confirmDelete = (id) => {
    setDeleteConfirm(id);
  };

  const cancelDelete = () => {
    setDeleteConfirm(null);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/dogs/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDogList((prev) => prev.filter((dog) => dog._id !== id));
      cancelDelete();
    } catch (err) {
      setError("Failed to delete dog.");
      console.error(err);
    }
  };

  if (!dogList || dogList.length === 0) {
    return (
      <p className="text-center text-gray-500 dark:text-gray-400">
        No dogs available.
      </p>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 print:grid-cols-1">
      {dogList.map((dog) => (
        <Card
          key={dog._id}
          className="relative bg-white dark:bg-gray-800 shadow-md transition hover:shadow-lg animate-fadeIn"
        >
          <CardContent className="p-4 space-y-2 text-gray-800 dark:text-gray-100">
            {editDogId === dog._id ? (
              <>
                {["name", "breed", "trainingStatus"].map((field) => (
                  <div key={field}>
                    <Label className="capitalize">{field}</Label>
                    <Input
                      name={field}
                      value={editForm[field] || ""}
                      onChange={handleInputChange}
                      className="dark:bg-gray-700"
                    />
                  </div>
                ))}

                <div className="flex justify-between pt-3">
                  <Button
                    onClick={handleEditSubmit}
                    className="transition-transform hover:scale-105"
                  >
                    Save
                  </Button>
                  <Button
                    variant="outline"
                    onClick={cancelEdit}
                    className="transition-transform hover:scale-105"
                  >
                    Cancel
                  </Button>
                </div>
              </>
            ) : (
              <>
                {dog.image && (
                  <img
                    src={dog.image}
                    alt="Dog"
                    className="w-full h-48 object-cover rounded"
                  />
                )}
                <p><strong>ID:</strong> {dog.id}</p>
                <p><strong>Name:</strong> {dog.name}</p>
                <p><strong>Breed:</strong> {dog.breed}</p>
                <p><strong>Training:</strong> {dog.trainingStatus}</p>
                <p><strong>Reserved:</strong> {dog.reserved ? "Yes" : "No"}</p>
                <p><strong>Age:</strong> {dog.age}</p>
                <p><strong>Weight:</strong> {dog.weight} lbs</p>
                <p><strong>Height:</strong> {dog.height} in</p>
                <p><strong>Gender:</strong> {dog.gender}</p>

                <div className="flex justify-between pt-3">
                  <Button
                    size="sm"
                    onClick={() => handleEditClick(dog)}
                    className="transition-transform hover:scale-105"
                  >
                    Edit
                  </Button>
                  {deleteConfirm === dog._id ? (
                    <div className="flex gap-2">
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(dog._id)}>Confirm</Button>
                      <Button size="sm" onClick={cancelDelete}>Cancel</Button>
                    </div>
                  ) : (
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => confirmDelete(dog._id)}
                      className="transition-transform hover:scale-105"
                    >
                      Delete
                    </Button>
                  )}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      ))}

      {error && (
        <div className="col-span-full text-center text-red-600 font-semibold animate-fadeIn">
          {error}
        </div>
      )}
    </div>
  );
}

DogList.propTypes = {
  dogs: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      id: PropTypes.string,
      name: PropTypes.string,
      breed: PropTypes.string,
      trainingStatus: PropTypes.string,
      reserved: PropTypes.bool,
      age: PropTypes.number,
      weight: PropTypes.number,
      height: PropTypes.number,
      gender: PropTypes.string,
      image: PropTypes.string,
    })
  ).isRequired,
};

export default DogList;
