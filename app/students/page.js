'use client';
import { useState } from 'react';
import { Dropdown } from 'react-bootstrap'; 
import studentsData from '../data/studentsData';
import coursesData from '../data/coursesData';

export default function StudentsPage() {
  const [students, setStudents] = useState(studentsData);
  const [newStudent, setNewStudent] = useState({ id: '', name: '', major: '', enrolledCourses: [] });
  const [searchTerm, setSearchTerm] = useState('');
  const [detailsVisible, setDetailsVisible] = useState({});
  const [editStudentId, setEditStudentId] = useState(null);
  const [editCourse, setEditCourse] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); // 用于显示错误信息

  const addStudent = () => {
    setStudents([...students, newStudent]);
    setNewStudent({ id: '', name: '', major: '', enrolledCourses: [] });
  };

  const deleteStudent = (studentId) => {
    setStudents(students.filter(student => student.id !== studentId));
  };

  const toggleDetails = (studentId) => {
    setDetailsVisible(prev => ({ ...prev, [studentId]: !prev[studentId] }));
  };

  const editStudent = (studentId) => {
    const student = students.find(student => student.id === studentId);
    if (student) {
      setEditStudentId(studentId);
      setNewStudent(student);
    }
  };

  const saveStudent = () => {
    setStudents(students.map(student =>
      student.id === editStudentId ? newStudent : student
    ));
    setEditStudentId(null);
    setNewStudent({ id: '', name: '', major: '', enrolledCourses: [] });
  };

  const addCourseToStudent = (studentId) => {
    const courseExists = coursesData.find(course => course.code === editCourse);
    
    if (!courseExists) {
      setErrorMessage('Course not found'); // 课程不存在时显示错误信息
      return;
    }
    
    setStudents(students.map(student =>
      student.id === studentId
        ? { ...student, enrolledCourses: [...student.enrolledCourses, editCourse] }
        : student
    ));
    setEditCourse('');
    setErrorMessage(''); // 重置错误信息
  };

  const removeCourseFromStudent = (studentId, courseCode) => {
    setStudents(students.map(student =>
      student.id === studentId
        ? { ...student, enrolledCourses: student.enrolledCourses.filter(code => code !== courseCode) }
        : student
    ));
  };

  const getCourseDetails = (courseCode) => {
    return coursesData.find(course => course.code === courseCode);
  };

  const categorizedStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||  
    student.id.toLowerCase().includes(searchTerm.toLowerCase()) ||    
    student.major.toLowerCase().includes(searchTerm.toLowerCase())    
  ).reduce((categories, student) => {
    const major = student.major;
    if (!categories[major]) {
      categories[major] = [];
    }
    categories[major].push(student);
    return categories;
  }, {});

  return (
    <div className="p-10">
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-2xl font-bold">Manage Students</h1>
        <Dropdown>
          <Dropdown.Toggle variant="primary" id="dropdown-basic">
            Navigate
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item href="/">Home</Dropdown.Item>
            <Dropdown.Item href="/courses">Courses</Dropdown.Item>
            <Dropdown.Item href="/students">Students</Dropdown.Item>
            <Dropdown.Item href="/teachers">Teachers</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>

      <div className="flex items-center mb-5">
        <input
          type="text"
          placeholder="Search by student name, ID, or major"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border p-2 mr-2"
          style={{ width: '50%' }}
        />
        <button className="bg-blue-500 text-white p-2">Search</button>
      </div>

      <div className="mb-5">
        <input
          type="text"
          placeholder="Student ID"
          value={newStudent.id}
          onChange={(e) => setNewStudent({ ...newStudent, id: e.target.value })}
          className="border p-2 mr-2"
        />
        <input
          type="text"
          placeholder="Student Name"
          value={newStudent.name}
          onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
          className="border p-2 mr-2"
        />
        <input
          type="text"
          placeholder="Major"
          value={newStudent.major}
          onChange={(e) => setNewStudent({ ...newStudent, major: e.target.value })}
          className="border p-2 mr-2"
        />
        <button onClick={editStudentId ? saveStudent : addStudent} className="bg-blue-500 text-white p-2">
          {editStudentId ? 'Save Student' : 'Add Student'}
        </button>
      </div>

      {errorMessage && (
        <div className="bg-red-500 text-white p-2 mb-4">
          {errorMessage}
        </div>
      )}

      <div className="mt-5">
        <h2 className="text-xl font-semibold mb-3">Students List</h2>
        {Object.keys(categorizedStudents).map((major) => (
          <div key={major} className="mb-4">
            <h3 className="text-lg font-bold mb-2">{major} Students</h3>
            <div className="grid grid-cols-4 gap-4 font-semibold">
              <div>ID</div>
              <div>Name</div>
              <div>Major</div>
              <div>Actions</div>
            </div>
            <ul className="list-disc mt-2">
              {categorizedStudents[major].map((student, index) => (
                <li key={index} className="grid grid-cols-4 gap-4 mb-2">
                  <div>{student.id}</div>
                  <div>{student.name}</div>
                  <div>{student.major}</div>
                  <div>
                    <button onClick={() => toggleDetails(student.id)} className="bg-gray-500 text-white p-1 mr-2">Details</button>
                    <button onClick={() => editStudent(student.id)} className="bg-green-500 text-white p-1 mr-2">Edit</button>
                    <button onClick={() => deleteStudent(student.id)} className="bg-red-500 text-white p-1">Delete</button>
                  </div>
                  {detailsVisible[student.id] && (
                    <div className="col-span-4 bg-gray-100 p-4 mt-2">
                      <h3 className="font-bold">Enrolled Courses:</h3>
                      <div className="grid grid-cols-4 gap-4 font-semibold">
                        <div>Code</div>
                        <div>Name</div>
                        <div>Teacher</div>
                        <div>Actions</div>
                      </div>
                      <ul>
                        {student.enrolledCourses.map((courseCode, idx) => {
                          const courseDetails = getCourseDetails(courseCode);
                          return courseDetails ? (
                            <li key={idx} className="grid grid-cols-4 gap-4 mb-2 items-center">
                              <div>{courseDetails.code}</div>
                              <div>{courseDetails.name}</div>
                              <div>{courseDetails.teacher}</div>
                              <button
                                onClick={() => removeCourseFromStudent(student.id, courseCode)}
                                className="bg-red-500 text-white text-sm px-2 py-1"
                              >
                                Remove
                              </button>
                            </li>
                          ) : (
                            <li key={idx} className="grid grid-cols-4 gap-4 mb-2 items-center text-red-500">
                              <div>Course Not Found</div>
                            </li>
                          );
                        })}
                      </ul>

                      <div className="flex mt-4">
                        <input
                          type="text"
                          placeholder="New Course Code"
                          value={editCourse}
                          onChange={(e) => setEditCourse(e.target.value)}
                          className="border p-2 mr-2"
                        />
                        <button onClick={() => addCourseToStudent(student.id)} className="bg-blue-500 text-white p-2">Add Course</button>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
