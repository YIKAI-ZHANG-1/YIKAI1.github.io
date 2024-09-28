'use client';
import { useState } from 'react';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import Link from 'next/link';  
import coursesData from '../data/coursesData';  

export default function CoursesPage() {
  const [courses, setCourses] = useState(coursesData);  
  const [newCourse, setNewCourse] = useState({ name: '', code: '', credits: 0, teacher: '', time: '', totalSeats: 0, enrolled: 0 });
  const [searchTerm, setSearchTerm] = useState('');  
  const [detailsVisible, setDetailsVisible] = useState({});  
  const [editCourseCode, setEditCourseCode] = useState(null);  

  const addCourse = () => {
    setCourses([...courses, newCourse]);
    setNewCourse({ name: '', code: '', credits: 0, teacher: '', time: '', totalSeats: 0, enrolled: 0 });
  };

  const deleteCourse = (courseCode) => {
    setCourses(courses.filter(course => course.code !== courseCode));
  };

  const toggleDetails = (courseCode) => {
    setDetailsVisible(prev => ({ ...prev, [courseCode]: !prev[courseCode] }));
  };

  const editCourse = (courseCode) => {
    const course = courses.find(course => course.code === courseCode);
    if (course) {
      setEditCourseCode(courseCode);
      setNewCourse(course);
    }
  };

  const saveCourse = () => {
    setCourses(courses.map(course =>
      course.code === editCourseCode ? newCourse : course
    ));
    setEditCourseCode(null);
    setNewCourse({ name: '', code: '', credits: 0, teacher: '', time: '', totalSeats: 0, enrolled: 0 });
  };

  const filteredCourses = courses.filter(course =>
    course.name.toLowerCase().startsWith(searchTerm.toLowerCase()) ||
    course.code.toLowerCase().startsWith(searchTerm.toLowerCase())
  );

  const categorizedCourses = filteredCourses.reduce((categories, course) => {
    const prefix = course.code.split(' ')[0];
    if (!categories[prefix]) {
      categories[prefix] = [];
    }
    categories[prefix].push(course);
    return categories;
  }, {});

  return (
    <div className="p-10">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="text-2xl font-bold mb-0">Manage Courses</h1>
        <DropdownButton id="dropdown-basic-button" title="Navigate">
          <Dropdown.Item>
            <Link href="/">Home</Link>
          </Dropdown.Item>
          <Dropdown.Item>
            <Link href="/courses">Manage Courses</Link>
          </Dropdown.Item>
          <Dropdown.Item>
            <Link href="/students">Manage Students</Link>
          </Dropdown.Item>
          <Dropdown.Item>
            <Link href="/teachers">Manage Teachers</Link>
          </Dropdown.Item>
        </DropdownButton>
      </div>
      
      <div className="flex items-center mb-5">
        <input
          type="text"
          placeholder="Search by course name or code"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border p-2 mr-2"
          style={{ width: '50%' }}
        />
        <button className="bg-blue-500 text-white p-2">Search</button>
      </div>

      <div className="mt-5">
        <h3 className="font-bold mb-2">Add/Edit Course</h3>

        {/* 使用 flexbox 将输入框和按钮排列在同一行 */}
        <div className="flex flex-wrap gap-4">
          <div className="flex-1">
            <label className="block mb-1">Course Code</label>
            <input
              type="text"
              placeholder="Course Code"
              value={newCourse.code}
              onChange={(e) => setNewCourse({ ...newCourse, code: e.target.value })}
              className="border p-2 mb-4 w-full"
            />
          </div>
          <div className="flex-1">
            <label className="block mb-1">Course Name</label>
            <input
              type="text"
              placeholder="Course Name"
              value={newCourse.name}
              onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })}
              className="border p-2 mb-4 w-full"
            />
          </div>
          <div className="flex-1">
            <label className="block mb-1">Credits</label>
            <input
              type="number"
              placeholder="Credits"
              value={newCourse.credits}
              onChange={(e) => setNewCourse({ ...newCourse, credits: e.target.value })}
              className="border p-2 mb-4 w-full"
            />
          </div>
          <div className="flex-1">
            <label className="block mb-1">Teacher</label>
            <input
              type="text"
              placeholder="Teacher"
              value={newCourse.teacher}
              onChange={(e) => setNewCourse({ ...newCourse, teacher: e.target.value })}
              className="border p-2 mb-4 w-full"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          <div className="flex-1">
            <label className="block mb-1">Course Time</label>
            <input
              type="text"
              placeholder="Course Time (e.g., 2024-01-01 12:00 - 14:00)"
              value={newCourse.time}
              onChange={(e) => setNewCourse({ ...newCourse, time: e.target.value })}
              className="border p-2 mb-4 w-full"
            />
          </div>
          <div className="flex-1">
            <label className="block mb-1">Total Seats</label>
            <input
              type="number"
              placeholder="Total Seats"
              value={newCourse.totalSeats}
              onChange={(e) => setNewCourse({ ...newCourse, totalSeats: e.target.value })}
              className="border p-2 mb-4 w-full"
            />
          </div>
          <div className="flex-1">
            <label className="block mb-1">Enrolled Students</label>
            <input
              type="number"
              placeholder="Enrolled Students"
              value={newCourse.enrolled}
              onChange={(e) => setNewCourse({ ...newCourse, enrolled: e.target.value })}
              className="border p-2 mb-4 w-full"
            />
          </div>
        </div>

        <div className="mt-4">
          <button onClick={editCourseCode ? saveCourse : addCourse} className="bg-blue-500 text-white p-2">
            {editCourseCode ? 'Save Course' : 'Add Course'}
          </button>
        </div>
      </div>

      <div className="mt-5">
        <h2 className="text-xl font-semibold mb-3">Courses List</h2>
        {Object.keys(categorizedCourses).map((category) => (
          <div key={category} className="mb-4">
            <h3 className="text-lg font-bold mb-2">{category} Courses</h3>
            <div className="grid grid-cols-6 gap-4 font-semibold">
              <div>Code</div>
              <div>Name</div>
              <div>Credits</div>
              <div>Seats</div>
              <div>Actions</div>
            </div>
            <ul className="list-disc mt-2">
              {categorizedCourses[category].map((course, index) => (
                <li key={index} className="grid grid-cols-6 gap-4 mb-2">
                  <div>{course.code}</div>
                  <div>{course.name}</div>
                  <div>{course.credits} Credits</div>
                  <div>{course.totalSeats} Seats</div>
                  <div>
                    <button onClick={() => toggleDetails(course.code)} className="bg-gray-500 text-white p-1 mr-2">Details</button>
                    <button onClick={() => editCourse(course.code)} className="bg-green-500 text-white p-1 mr-2">Edit</button>
                    <button onClick={() => deleteCourse(course.code)} className="bg-red-500 text-white p-1">Delete</button>
                  </div>
                  {detailsVisible[course.code] && (
                    <div className="col-span-6 bg-gray-100 p-4 mt-2">
                      <p><strong>Teacher:</strong> {course.teacher}</p>
                      <p><strong>Time:</strong> {course.time}</p>
                      <p><strong>Total Seats:</strong> {course.totalSeats}</p>
                      <p><strong>Enrolled Students:</strong> {course.enrolled}</p>
                      <p><strong>Available Seats:</strong> {course.totalSeats - course.enrolled}</p>
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
