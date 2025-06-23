// src/components/MonkeyList.js

import React from "react";
import PropTypes from "prop-types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// MonkeyList displays monkey cards with edit/delete functionality
function MonkeyList({ monkeys, onEdit, onDelete }) {
  if (!monkeys || monkeys.length === 0) {
    return (
      <p className="text-center text-gray-500 dark:text-gray-400 animate-fadeIn">
        No monkeys available.
      </p>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {monkeys.map((monkey) => (
        <Card
          key={monkey._id}
          className="relative bg-white dark:bg-gray-800 shadow-md dark:shadow-gray-700 transition hover:shadow-lg animate-fadeIn"
        >
          <CardContent className="p-4 space-y-1 text-gray-800 dark:text-gray-100">
            <p><strong>ID:</strong> {monkey.id}</p>
            <p><strong>Name:</strong> {monkey.name}</p>
            <p><strong>Species:</strong> {monkey.species}</p>
            <p><strong>Training Status:</strong> {monkey.trainingStatus}</p>
            <p><strong>Reserved:</strong> {monkey.reserved ? "Yes" : "No"}</p>
            <p><strong>Age:</strong> {monkey.age}</p>
            <p><strong>Weight:</strong> {monkey.weight} lbs</p>
            <p><strong>Height:</strong> {monkey.height} in</p>
            <p><strong>Tail Length:</strong> {monkey.tailLength} in</p>
            <p><strong>Gender:</strong> {monkey.gender}</p>

            <div className="pt-3 flex justify-between">
              <Button
                size="sm"
                onClick={() => onEdit(monkey)}
                className="hover:scale-105 transition-transform"
              >
                Edit
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => onDelete(monkey._id)}
                className="hover:scale-105 transition-transform"
              >
                Delete
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Prop validation for MonkeyList
MonkeyList.propTypes = {
  monkeys: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      id: PropTypes.string,
      name: PropTypes.string,
      species: PropTypes.string,
      trainingStatus: PropTypes.string,
      reserved: PropTypes.bool,
      age: PropTypes.number,
      weight: PropTypes.number,
      height: PropTypes.number,
      tailLength: PropTypes.number,
      gender: PropTypes.string,
    })
  ).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default MonkeyList;
