import React, { useState } from "react";

function QuestionForm({ onNewQuestion }) {
  const [formData, setFormData] = useState({
    prompt: "",
    answer1: "",
    answer2: "",
    answer3: "",
    answer4: "",
    correctIndex: 0, // This needs to be a number
  });
  const [loading, setLoading] = useState(false); // To manage loading state
  const [error, setError] = useState(null); // To store error messages

  // Handle input changes for form fields
  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: name === "correctIndex" ? Number(value) : value, // Convert correctIndex to number
    }));
  }

  // Handle form submission
  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true); // Start loading state

    try {
      const response = await fetch("http://localhost:4000/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: formData.prompt,
          answers: [
            formData.answer1,
            formData.answer2,
            formData.answer3,
            formData.answer4,
          ],
          correctIndex: formData.correctIndex,
        }),
      });

      if (response.ok) {
        const newQuestion = await response.json();
        onNewQuestion(newQuestion); // Pass the newly added question to the parent
        setFormData({
          prompt: "",
          answer1: "",
          answer2: "",
          answer3: "",
          answer4: "",
          correctIndex: 0,
        }); // Reset the form
      } else {
        throw new Error("Failed to add question");
      }
    } catch (error) {
      setError("Error adding question. Please try again.");
      console.error("Error adding question:", error);
    } finally {
      setLoading(false); // End loading state
    }
  }

  return (
    <section>
      <h1>New Question</h1>
      <form onSubmit={handleSubmit}>
        {error && <p style={{ color: "red" }}>{error}</p>} {/* Show error message */}
        <label htmlFor="prompt">
          Prompt:
          <input
            type="text"
            name="prompt"
            value={formData.prompt}
            onChange={handleChange}
            id="prompt"
            required
          />
        </label>
        <label htmlFor="answer1">
          Answer 1:
          <input
            type="text"
            name="answer1"
            value={formData.answer1}
            onChange={handleChange}
            id="answer1"
            required
          />
        </label>
        <label htmlFor="answer2">
          Answer 2:
          <input
            type="text"
            name="answer2"
            value={formData.answer2}
            onChange={handleChange}
            id="answer2"
            required
          />
        </label>
        <label htmlFor="answer3">
          Answer 3:
          <input
            type="text"
            name="answer3"
            value={formData.answer3}
            onChange={handleChange}
            id="answer3"
            required
          />
        </label>
        <label htmlFor="answer4">
          Answer 4:
          <input
            type="text"
            name="answer4"
            value={formData.answer4}
            onChange={handleChange}
            id="answer4"
            required
          />
        </label>
        <label htmlFor="correctIndex">
          Correct Answer:
          <select
            name="correctIndex"
            value={formData.correctIndex}
            onChange={handleChange}
            id="correctIndex"
            required
          >
            <option value="0">{formData.answer1}</option>
            <option value="1">{formData.answer2}</option>
            <option value="2">{formData.answer3}</option>
            <option value="3">{formData.answer4}</option>
          </select>
        </label>
        <button type="submit" disabled={loading}>
          {loading ? "Adding..." : "Add Question"}
        </button>
      </form>
    </section>
  );
}

export default QuestionForm;



