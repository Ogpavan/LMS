"use client";
import React, { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/Input";
import Loader from "@/components/Loader";
import { ChevronDown } from "lucide-react";

export default function InstructorsPage() {
  const [instructors, setInstructors] = useState([]);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [adding, setAdding] = useState(false);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [form, setForm] = useState({
    username: "",
    name: "",
    email: "",
    mobile: "",
    gender: "",
    password: "",
  });
  const [editForm, setEditForm] = useState({
    id: "",
    username: "",
    name: "",
    email: "",
    mobile: "",
    gender: "",
  });
  const [error, setError] = useState("");

  // Fetch instructors from API
  useEffect(() => {
    async function fetchInstructors() {
      const res = await fetch("/api/instructors");
      const data = await res.json();
      setInstructors(data.instructors || []);
      setLoading(false);
    }
    fetchInstructors();
  }, []);

  // Change instructor status
  const handleStatusChange = async (id, status) => {
    await fetch(`/api/instructors/${id}/status`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setInstructors((prev) =>
      prev.map((inst) => (inst.id === id ? { ...inst, status } : inst))
    );
  };

  // Add instructor
  const handleAddInstructor = async (e) => {
    e.preventDefault();
    setError("");
    setAdding(true);
    const res = await fetch("/api/instructors", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, role: "instructor" }),
    });
    setAdding(false);
    const data = await res.json();
    if (data.success) {
      setInstructors((prev) => [data.instructor, ...prev]);
      setOpen(false);
      setForm({
        username: "",
        name: "",
        email: "",
        mobile: "",
        gender: "",
        password: "",
      });
    } else {
      setError(data.error || "Failed to add instructor");
    }
  };

  // Open edit dialog and fill form
  const handleEditClick = (inst) => {
    setEditForm({
      id: inst.id,
      username: inst.username,
      name: inst.name,
      email: inst.email,
      mobile: inst.mobile,
      gender: inst.gender,
    });
    setEditOpen(true);
  };

  // Handle edit form change
  const handleEditFormChange = (e) =>
    setEditForm({ ...editForm, [e.target.name]: e.target.value });

  // Submit edit
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const res = await fetch(`/api/instructors/${editForm.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editForm),
    });
    const data = await res.json();
    setSaving(false);
    if (data.success) {
      setInstructors((prev) =>
        prev.map((inst) =>
          inst.id === editForm.id ? { ...inst, ...editForm } : inst
        )
      );
      setEditOpen(false);
    }
    // Optionally handle errors here
  };

  const handleFormChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleDeleteInstructor = async (id) => {
    // Optionally show a confirmation dialog here
    await fetch(`/api/instructors/${id}/delete`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    setInstructors((prev) => prev.filter((inst) => inst.id !== id));
  };

  return (
    <div className="min-h-screen flex flex-col items-center py-10 w-full">
      <div className="w-full max-w-7xl bg-white rounded-2xl border border-gray-200/60 p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
            🍏 Instructors
          </h2>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button
                className="bg-blue-600 text-white px-4 py-2 rounded-full font-medium shadow hover:bg-blue-700 transition"
                onClick={() => setOpen(true)}
              >
                Add Instructor
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Instructor</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddInstructor} className="space-y-4 mt-2">
                {error && <div className="text-red-500 text-sm">{error}</div>}
                <Input
                  name="username"
                  placeholder="Username"
                  value={form.username}
                  onChange={handleFormChange}
                  className="w-full p-2 border rounded"
                  required
                />
                <Input
                  name="name"
                  placeholder="Name"
                  value={form.name}
                  onChange={handleFormChange}
                  className="w-full p-2 border rounded"
                  required
                />
                <Input
                  name="email"
                  type="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={handleFormChange}
                  className="w-full p-2 border rounded"
                  required
                />
                <Input
                  name="password"
                  type="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={handleFormChange}
                  className="w-full p-2 border rounded"
                  required
                />
                <Input
                  name="mobile"
                  type="tel"
                  placeholder="Mobile"
                  value={form.mobile}
                  onChange={handleFormChange}
                  className="w-full p-2 border rounded"
                  required
                />
                <select
                  name="gender"
                  value={form.gender}
                  onChange={handleFormChange}
                  className="w-full p-2 border rounded"
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                <DialogFooter>
                  <Button
                    className="bg-blue-600 text-white px-4 py-2 rounded-full font-medium shadow hover:bg-blue-700 transition w-full flex items-center justify-center"
                    type="submit"
                    disabled={adding}
                  >
                    {adding ? (
                      <span className="flex items-center gap-2">
                        <svg
                          className="animate-spin h-4 w-4 text-white"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 01-8 8z"
                          />
                        </svg>
                        Adding...
                      </span>
                    ) : (
                      "Add"
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        <table className="w-full text-left border-separate border-spacing-y-2 ">
          <thead>
            <tr className="text-gray-500 text-xs uppercase tracking-wide">
              <th className="py-2 px-3 rounded-tl-xl">Username</th>
              <th className="py-2 px-3">Name</th>
              <th className="py-2 px-3">Email</th>
              <th className="py-2 px-3">Mobile</th>
              <th className="py-2 px-3">Gender</th>
              <th className="py-2 px-6">Status</th>
              <th className="py-2 px-8 ">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="py-12 text-center">
                  <Loader />
                </td>
              </tr>
            ) : instructors.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center text-gray-400 py-8">
                  No instructors found.
                </td>
              </tr>
            ) : (
              instructors.map((inst) => (
                <tr
                  key={inst.id}
                  className="bg-gray-50 text-sm tracking-tight   rounded transition-all"
                >
                  <td className="py-2 px-3 font-medium text-gray-900 rounded-l-xl">
                    @{inst.username}
                  </td>
                  <td className="py-2 px-3 text-gray-700">{inst.name}</td>
                  <td className="py-2 px-3 text-gray-700">{inst.email}</td>
                  <td className="py-2 px-3 text-gray-700">{inst.mobile}</td>
                  <td className="py-2 px-3 text-gray-700">{inst.gender}</td>
                  <td className="py-2 px-3">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          className={`px-3 py-1 rounded-full text-sm font-normal   focus:outline-none ${
                            inst.status === "pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : inst.status === "active"
                              ? "bg-green-100 text-green-700 text-xs"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          <div className="flex items-center">
                            {inst.status === "pending"
                              ? "Pending"
                              : inst.status === "active"
                              ? "Approved"
                              : "Blocked"}
                            <hr className=" mx-1 h-4 w-px bg-gray-300" />
                            <ChevronDown className="  h-2  w-2" />
                          </div>
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem
                          onSelect={() => handleStatusChange(inst.id, "active")}
                        >
                          Approve
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onSelect={() =>
                            handleStatusChange(inst.id, "pending")
                          }
                        >
                          Pending
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onSelect={() =>
                            handleStatusChange(inst.id, "blocked")
                          }
                          variant="destructive"
                        >
                          Blocked
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                  <td className="py-2 px-3 rounded-r-xl flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditClick(inst)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        setDeleteId(inst.id);
                        setDeleteOpen(true);
                      }}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        {/* Edit Dialog */}
        <Dialog open={editOpen} onOpenChange={setEditOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Instructor</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleEditSubmit} className="space-y-4 mt-2">
              <Input
                name="username"
                placeholder="Username"
                value={editForm.username}
                onChange={handleEditFormChange}
                className="w-full p-2 border rounded"
                required
              />
              <Input
                name="name"
                placeholder="Name"
                value={editForm.name}
                onChange={handleEditFormChange}
                className="w-full p-2 border rounded"
                required
              />
              <Input
                name="email"
                type="email"
                placeholder="Email"
                value={editForm.email}
                onChange={handleEditFormChange}
                className="w-full p-2 border rounded"
                required
              />
              <Input
                name="mobile"
                type="tel"
                placeholder="Mobile"
                value={editForm.mobile}
                onChange={handleEditFormChange}
                className="w-full p-2 border rounded"
                required
              />
              <select
                name="gender"
                value={editForm.gender}
                onChange={handleEditFormChange}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              <DialogFooter>
                <Button
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded-full font-medium shadow hover:bg-blue-700 transition"
                  type="submit"
                  disabled={saving}
                >
                  {saving ? (
                    <span className="flex items-center gap-2">
                      <svg
                        className="animate-spin h-4 w-4 text-white"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 01-8 8z"
                        />
                      </svg>
                      Saving...
                    </span>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
        {/* Delete Dialog */}
        <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Instructor</DialogTitle>
            </DialogHeader>
            <p className="text-center text-gray-700 mb-4">
              Are you sure you want to delete this instructor? This action
              cannot be undone.
            </p>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setDeleteOpen(false)}
                disabled={deleting}
              >
                Cancel
              </Button>
              <Button
                className={
                  "bg-red-600 text-white px-5 py-2 rounded-full font-medium  hover:bg-red-700 transition shadow-sm"
                }
                onClick={async () => {
                  setDeleting(true);
                  await fetch(`/api/instructors/${deleteId}/delete`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                  });
                  setInstructors((prev) =>
                    prev.filter((inst) => inst.id !== deleteId)
                  );
                  setDeleting(false);
                  setDeleteOpen(false);
                }}
                disabled={deleting}
              >
                {deleting ? (
                  <span className="flex items-center gap-2">
                    <svg
                      className="animate-spin h-4 w-4 text-white"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 01-8 8z"
                      />
                    </svg>
                    Deleting...
                  </span>
                ) : (
                  "Delete"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
