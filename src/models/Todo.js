const mongoose = require("mongoose");

const TodoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      minlength: [1, "Title must be at least 1 character"],
      maxlength: [120, "Title must be 120 characters or less"]
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [500, "Notes must be 500 characters or less"],
      default: ""
    },
    completed: {
      type: Boolean,
      default: false
    },
    dueDate: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

TodoSchema.index({ title: "text", notes: "text" });

module.exports = mongoose.model("Todo", TodoSchema);

