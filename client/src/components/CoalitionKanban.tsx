import { useState } from "react";
import { trpc } from "@/_core/trpc";
import { Plus, CheckCircle2, Clock, AlertCircle, ArrowRight, ArrowLeft, Trash2, Calendar, User, Building2, Tag, RefreshCw } from "lucide-react";
import { toast } from "sonner";

interface CoalitionKanbanProps {
  coalitionId?: number;
  coalitionName?: string;
}

const STAGES = [
  { id: "backlog", label: "Backlog", color: "border-gray-300 bg-gray-50/60" },
  { id: "todo", label: "To Do", color: "border-blue-200 bg-blue-50/30" },
  { id: "in_progress", label: "In Progress", color: "border-amber-200 bg-amber-50/30" },
  { id: "review", label: "In Review / QA", color: "border-purple-200 bg-purple-50/30" },
  { id: "done", label: "Completed", color: "border-emerald-200 bg-emerald-50/30" },
];

export default function CoalitionKanban({
  coalitionId = 1,
  coalitionName = "Education & Healthcare Tech Alliance",
}: CoalitionKanbanProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newAssignee, setNewAssignee] = useState("Elena Rostova");
  const [newOrg, setNewOrg] = useState("Community Health Net");
  const [newPriority, setNewPriority] = useState<"low" | "medium" | "high" | "urgent">("high");
  const [newStage, setNewStage] = useState<"backlog" | "todo" | "in_progress" | "review" | "done">("todo");

  const { data: tasks, refetch, isLoading } = trpc.coalitionWorkspace.getTasks.useQuery({
    coalitionId,
  });

  const createTaskMutation = trpc.coalitionWorkspace.createTask.useMutation({
    onSuccess: () => {
      setShowAddModal(false);
      setNewTitle("");
      setNewDescription("");
      refetch();
      toast.success("Coalition milestone task added");
    },
    onError: (err) => {
      toast.error(err.message || "Failed to create task");
    },
  });

  const updateStageMutation = trpc.coalitionWorkspace.updateTaskStage.useMutation({
    onSuccess: () => {
      refetch();
      toast.success("Task stage updated");
    },
    onError: (err) => {
      toast.error(err.message || "Failed to update task");
    },
  });

  const deleteTaskMutation = trpc.coalitionWorkspace.deleteTask.useMutation({
    onSuccess: () => {
      refetch();
      toast.success("Task removed");
    },
    onError: (err) => {
      toast.error(err.message || "Failed to delete task");
    },
  });

  const handleCreateTask = () => {
    if (!newTitle.trim()) return;
    createTaskMutation.mutate({
      coalitionId,
      title: newTitle,
      description: newDescription,
      assigneeName: newAssignee,
      assigneeOrg: newOrg,
      priority: newPriority,
      stage: newStage,
      tags: ["Joint Initiative"],
    });
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "urgent":
        return <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-red-100 text-red-800">Urgent</span>;
      case "high":
        return <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-100 text-amber-800">High</span>;
      case "medium":
        return <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-100 text-blue-800">Medium</span>;
      default:
        return <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-gray-100 text-gray-700">Low</span>;
    }
  };

  const moveStage = (taskId: number, currentStage: string, direction: "prev" | "next") => {
    const stageIds = STAGES.map(s => s.id);
    const currIdx = stageIds.indexOf(currentStage);
    const nextIdx = direction === "next" ? currIdx + 1 : currIdx - 1;
    if (nextIdx >= 0 && nextIdx < stageIds.length) {
      updateStageMutation.mutate({
        taskId,
        stage: stageIds[nextIdx] as any,
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-gray-900">Milestone Roadmap & Task Board</h3>
          <p className="text-xs text-gray-500">
            Collaborative task management for {coalitionName} joint deployment goals.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center px-3.5 py-2 rounded-lg bg-[#1D9E75] hover:bg-[#16815f] text-white text-xs font-semibold shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          Add Milestone Task
        </button>
      </div>

      {/* Kanban 5-Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {STAGES.map((col) => {
          const colTasks = tasks?.filter((t: any) => t.stage === col.id) || [];

          return (
            <div
              key={col.id}
              className={`rounded-xl border p-3 flex flex-col min-h-[480px] shadow-xs ${col.color}`}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-gray-200">
                <span className="text-xs font-bold text-gray-800 uppercase tracking-wide">
                  {col.label}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white text-gray-700 border border-gray-200">
                  {colTasks.length}
                </span>
              </div>

              {/* Tasks in Column */}
              <div className="flex-1 space-y-2.5 overflow-y-auto">
                {isLoading ? (
                  <div className="text-center py-8 text-gray-400 text-xs">
                    <RefreshCw className="w-4 h-4 mx-auto animate-spin mb-1" /> Loading...
                  </div>
                ) : colTasks.length > 0 ? (
                  colTasks.map((task: any) => (
                    <div
                      key={task.id}
                      className="bg-white rounded-lg border border-gray-200 p-3 shadow-xs hover:border-gray-300 transition-all space-y-2"
                    >
                      <div className="flex items-start justify-between gap-1.5">
                        <span className="text-xs font-semibold text-gray-900 leading-snug">
                          {task.title}
                        </span>
                        {getPriorityBadge(task.priority)}
                      </div>

                      {task.description && (
                        <p className="text-[11px] text-gray-600 line-clamp-2 leading-relaxed">
                          {task.description}
                        </p>
                      )}

                      {/* Meta info */}
                      <div className="pt-2 border-t border-gray-100 flex flex-col gap-1 text-[10px] text-gray-500">
                        <div className="flex items-center gap-1 truncate">
                          <User className="w-3 h-3 text-gray-400 shrink-0" />
                          <span className="font-medium text-gray-700 truncate">{task.assigneeName}</span>
                          <span className="text-gray-400 truncate">({task.assigneeOrg})</span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-400">
                          <Calendar className="w-3 h-3 shrink-0" />
                          <span>Due: {new Date(task.dueDate).toLocaleDateString([], { month: "short", day: "numeric" })}</span>
                        </div>
                      </div>

                      {/* Card Actions: Move left / right / delete */}
                      <div className="pt-1.5 border-t border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          {col.id !== "backlog" && (
                            <button
                              onClick={() => moveStage(task.id, task.stage, "prev")}
                              className="p-1 rounded bg-gray-50 hover:bg-gray-100 text-gray-600 cursor-pointer"
                              title="Move to previous stage"
                            >
                              <ArrowLeft className="w-3 h-3" />
                            </button>
                          )}
                          {col.id !== "done" && (
                            <button
                              onClick={() => moveStage(task.id, task.stage, "next")}
                              className="p-1 rounded bg-emerald-50 hover:bg-emerald-100 text-[#1D9E75] cursor-pointer"
                              title="Move to next stage"
                            >
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          )}
                        </div>

                        <button
                          onClick={() => deleteTaskMutation.mutate({ taskId: task.id })}
                          className="p-1 text-gray-400 hover:text-red-600 cursor-pointer"
                          title="Delete task"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="h-full flex items-center justify-center text-center p-4 border border-dashed border-gray-200 rounded-lg text-gray-400 text-[11px]">
                    No tasks in {col.label.toLowerCase()}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-gray-900">Create Coalition Milestone Task</h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Task Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Integrate Translation Agent on Clinic Tablets"
                  className="w-full p-2.5 border border-gray-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Description & Deliverables</label>
                <textarea
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  rows={3}
                  placeholder="Detail key technical deliverables and member expectations..."
                  className="w-full p-2.5 border border-gray-200 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Assignee Lead</label>
                  <input
                    type="text"
                    value={newAssignee}
                    onChange={(e) => setNewAssignee(e.target.value)}
                    className="w-full p-2 border border-gray-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Member Organization</label>
                  <input
                    type="text"
                    value={newOrg}
                    onChange={(e) => setNewOrg(e.target.value)}
                    className="w-full p-2 border border-gray-200 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Priority</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as any)}
                    className="w-full p-2 border border-gray-200 rounded-lg bg-white"
                  >
                    <option value="urgent">Urgent</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Initial Stage</label>
                  <select
                    value={newStage}
                    onChange={(e) => setNewStage(e.target.value as any)}
                    className="w-full p-2 border border-gray-200 rounded-lg bg-white"
                  >
                    <option value="todo">To Do</option>
                    <option value="backlog">Backlog</option>
                    <option value="in_progress">In Progress</option>
                    <option value="review">In Review</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-3.5 py-2 rounded-lg border border-gray-200 text-gray-700 text-xs font-semibold hover:bg-gray-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateTask}
                disabled={createTaskMutation.isPending || !newTitle.trim()}
                className="px-4 py-2 rounded-lg bg-[#1D9E75] hover:bg-[#16815f] text-white text-xs font-semibold shadow-xs disabled:opacity-50 cursor-pointer"
              >
                {createTaskMutation.isPending ? "Creating..." : "Save Milestone Task"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
