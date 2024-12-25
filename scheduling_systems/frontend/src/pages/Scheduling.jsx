import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getEmployeesData,
  getAdminEmail,
  getScheduleSentState,
  getLoadingState,
  toggleScheduleSent,
} from "../reducer/employeesSlice";
import { useNavigate } from "react-router-dom";
import { submitSchedule } from "../reducer/employeesSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Scheduling = () => {
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  const [scheduleComment, setScheduleComment] = useState("");
  const employeesData = useSelector(getEmployeesData);
  const adminEmail = useSelector(getAdminEmail);
  const isScheduleSent = useSelector(getScheduleSentState);
  const isLoading = useSelector(getLoadingState);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const notify = () =>
    toast.success("All meeting notifications sent successfully!");

  const handleEmployeeChange = (employee) => {
    setSelectedEmployees((prevSelected) => {
      if (prevSelected.some((emp) => emp.id === employee.id)) {
        return prevSelected.filter((emp) => emp.id !== employee.id);
      } else {
        return [...prevSelected, employee];
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const scheduleData = {
      employees: selectedEmployees.map((emp) => ({
        id: emp.id,
        name: emp.name,
        email: emp.email,
      })),
      date: scheduleDate,
      time: scheduleTime,
      comment: scheduleComment,
      adminEmail: adminEmail,
    };
    dispatch(submitSchedule(scheduleData));
    setSelectedEmployees([]);
    setScheduleDate("");
    setScheduleTime("");
    setScheduleComment("");
  };

  useEffect(() => {
    if (employeesData.length <= 0) {
      navigate("/");
    }
  }, [employeesData.length, navigate]);

  useEffect(() => {
    if (isScheduleSent) {
      notify();
      const timer = setTimeout(() => {
        dispatch(toggleScheduleSent());
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [dispatch, isScheduleSent]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h2 className="text-2xl font-bold mb-4">Schedule Employees</h2>
      <form
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-md"
        onSubmit={handleSubmit}
      >
        <div className="mb-4 overflow-y-auto max-h-64">
          <h3 className="text-lg font-semibold mb-2">Select Employees</h3>
          {employeesData.map((employee) => (
            <div key={employee.id} className="flex items-center mb-2">
              <input
                type="checkbox"
                id={`employee-${employee.id}`}
                checked={selectedEmployees.some(
                  (emp) => emp.id === employee.id
                )}
                onChange={() => handleEmployeeChange(employee)}
                className="mr-2"
              />
              <label
                htmlFor={`employee-${employee.id}`}
                className="text-gray-700"
              >
                {employee.name} ({employee.email})
              </label>
            </div>
          ))}
        </div>
        <div className="mb-4">
          <label
            htmlFor="scheduleDate"
            className="block text-sm font-medium text-gray-600"
          >
            Select Date
          </label>
          <input
            type="date"
            id="scheduleDate"
            value={scheduleDate}
            onChange={(e) => setScheduleDate(e.target.value)}
            min={new Date().toISOString().split("T")[0]}
            required
            className="block w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="scheduleTime"
            className="block text-sm font-medium text-gray-600"
          >
            Select Time
          </label>
          <input
            type="time"
            id="scheduleTime"
            value={scheduleTime}
            onChange={(e) => setScheduleTime(e.target.value)}
            required
            className="block w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="scheduleComment"
            className="block text-sm font-medium text-gray-600"
          >
            Schedule Comment
          </label>
          <textarea
            id="scheduleComment"
            value={scheduleComment}
            onChange={(e) => setScheduleComment(e.target.value)}
            maxLength={200}
            rows={3}
            className="block w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
            placeholder="Enter a comment (max 200 characters)"
          />
        </div>
        <button
          type="submit"
          className={`w-full px-4 py-2 font-semibold text-white rounded-md focus:outline-none focus:ring focus:ring-blue-300 ${
            isLoading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "Submit Schedule"}
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default Scheduling;
