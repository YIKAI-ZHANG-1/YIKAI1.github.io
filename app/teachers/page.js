'use client';
import { useState } from 'react';
import { Dropdown } from 'react-bootstrap'; // 导入Dropdown组件
import teachersData from '../data/teachersData';
import coursesData from '../data/coursesData';

export default function TeachersPage() {
  const [teachers, setTeachers] = useState(teachersData); // 初始化老师数据
  const [newTeacher, setNewTeacher] = useState({ id: '', name: '', major: '', coursesTaught: [] });
  const [searchTerm, setSearchTerm] = useState('');  // 搜索框的状态
  const [detailsVisible, setDetailsVisible] = useState({}); // 控制细节显示状态
  const [editTeacherId, setEditTeacherId] = useState(null); // 当前编辑的老师ID
  const [editCourse, setEditCourse] = useState(''); // 新增或修改课程时的课程代码
  const [errorMessage, setErrorMessage] = useState(''); // 错误提示信息

  const addTeacher = () => {
    setTeachers([...teachers, newTeacher]);
    setNewTeacher({ id: '', name: '', major: '', coursesTaught: [] });
  };

  const deleteTeacher = (teacherId) => {
    setTeachers(teachers.filter(teacher => teacher.id !== teacherId));
  };

  const toggleDetails = (teacherId) => {
    setDetailsVisible(prev => ({ ...prev, [teacherId]: !prev[teacherId] }));
  };

  const editTeacher = (teacherId) => {
    const teacher = teachers.find(teacher => teacher.id === teacherId);
    if (teacher) {
      setEditTeacherId(teacherId);
      setNewTeacher(teacher);
    }
  };

  const saveTeacher = () => {
    setTeachers(teachers.map(teacher =>
      teacher.id === editTeacherId ? newTeacher : teacher
    ));
    setEditTeacherId(null);
    setNewTeacher({ id: '', name: '', major: '', coursesTaught: [] });
  };

  const addCourseToTeacher = (teacherId) => {
    const courseDetails = getCourseDetails(editCourse);

    if (!courseDetails) {
      // 如果找不到课程，设置错误信息并返回
      setErrorMessage(`Course with code "${editCourse}" not found`);
      return;
    }

    // 重置错误信息
    setErrorMessage('');

    setTeachers(teachers.map(teacher =>
      teacher.id === teacherId
        ? { ...teacher, coursesTaught: [...teacher.coursesTaught, editCourse] }
        : teacher
    ));
    setEditCourse(''); // 重置输入框
  };

  const removeCourseFromTeacher = (teacherId, courseCode) => {
    setTeachers(teachers.map(teacher =>
      teacher.id === teacherId
        ? { ...teacher, coursesTaught: teacher.coursesTaught.filter(code => code !== courseCode) }
        : teacher
    ));
  };

  const getCourseDetails = (courseCode) => {
    return coursesData.find(course => course.code === courseCode);
  };

  // 按照 Major 分类老师，并根据搜索词进行部分匹配
  const categorizedTeachers = teachers.filter(teacher =>
    teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||   // 匹配名字
    teacher.id.toLowerCase().includes(searchTerm.toLowerCase()) ||     // 匹配ID
    teacher.major.toLowerCase().includes(searchTerm.toLowerCase())     // 匹配专业
  ).reduce((categories, teacher) => {
    const major = teacher.major;
    if (!categories[major]) {
      categories[major] = [];
    }
    categories[major].push(teacher);
    return categories;
  }, {});

  return (
    <div className="p-10">
      {/* 标题和导航按钮容器 */}
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-2xl font-bold">Manage Teachers</h1>
        
        {/* 导航按钮 */}
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

      {/* 搜索框 */}
      <div className="flex items-center mb-5">
        <input
          type="text"
          placeholder="Search by teacher name, ID, or major"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border p-2 mr-2"
          style={{ width: '50%' }}
        />
        <button className="bg-blue-500 text-white p-2">Search</button>
      </div>

      {/* 添加或编辑老师的表单 */}
      <div className="mb-5">
        <input
          type="text"
          placeholder="Teacher ID"
          value={newTeacher.id}
          onChange={(e) => setNewTeacher({ ...newTeacher, id: e.target.value })}
          className="border p-2 mr-2"
        />
        <input
          type="text"
          placeholder="Teacher Name"
          value={newTeacher.name}
          onChange={(e) => setNewTeacher({ ...newTeacher, name: e.target.value })}
          className="border p-2 mr-2"
        />
        <input
          type="text"
          placeholder="Major"
          value={newTeacher.major}
          onChange={(e) => setNewTeacher({ ...newTeacher, major: e.target.value })}
          className="border p-2 mr-2"
        />
        <button onClick={editTeacherId ? saveTeacher : addTeacher} className="bg-blue-500 text-white p-2">
          {editTeacherId ? 'Save Teacher' : 'Add Teacher'}
        </button>
      </div>

      {/* 错误信息 */}
      {errorMessage && <div className="text-red-500 mb-4">{errorMessage}</div>}

      {/* 老师列表，按 Major 分类 */}
      <div className="mt-5">
        <h2 className="text-xl font-semibold mb-3">Teachers List</h2>
        {Object.keys(categorizedTeachers).map((major) => (
          <div key={major} className="mb-4">
            <h3 className="text-lg font-bold mb-2">{major} Teachers</h3>
            <div className="grid grid-cols-4 gap-4 font-semibold">
              <div>ID</div>
              <div>Name</div>
              <div>Major</div>
              <div>Actions</div>
            </div>
            <ul className="list-disc mt-2">
              {categorizedTeachers[major].map((teacher, index) => (
                <li key={index} className="grid grid-cols-4 gap-4 mb-2">
                  <div>{teacher.id}</div>
                  <div>{teacher.name}</div>
                  <div>{teacher.major}</div>
                  <div>
                    <button onClick={() => toggleDetails(teacher.id)} className="bg-gray-500 text-white p-1 mr-2">Details</button>
                    <button onClick={() => editTeacher(teacher.id)} className="bg-green-500 text-white p-1 mr-2">Edit</button>
                    <button onClick={() => deleteTeacher(teacher.id)} className="bg-red-500 text-white p-1">Delete</button>
                  </div>
                  {detailsVisible[teacher.id] && (
                    <div className="col-span-4 bg-gray-100 p-4 mt-2">
                      <h3 className="font-bold">Courses Taught:</h3>
                      <div className="grid grid-cols-4 gap-4 font-semibold">
                        <div>Code</div>
                        <div>Name</div>
                        <div>Credits</div>
                        <div>Actions</div> {/* 添加Actions列 */}
                      </div>
                      <ul>
                        {teacher.coursesTaught.map((courseCode, idx) => {
                          const courseDetails = getCourseDetails(courseCode);
                          return (
                            <li key={idx} className="grid grid-cols-4 gap-4 mb-2 items-center">
                              <div>{courseDetails?.code || courseCode}</div> {/* 显示课程代码 */}
                              <div>{courseDetails?.name || 'Course not found'}</div> {/* 提示课程不存在 */}
                              <div>{courseDetails?.credits ? `${courseDetails.credits} Credits` : 'N/A'}</div> {/* 显示N/A如果没有学分 */}
                              <button
                                onClick={() => removeCourseFromTeacher(teacher.id, courseCode)}
                                className="bg-red-500 text-white text-sm px-2 py-1"  // 缩小按钮
                              >
                                Remove
                              </button>
                            </li>
                          );
                        })}
                      </ul>

                      {/* 添加新课程 */}
                      <div className="flex mt-4">
                        <input
                          type="text"
                          placeholder="New Course Code"
                          value={editCourse}
                          onChange={(e) => setEditCourse(e.target.value)}
                          className="border p-2 mr-2"
                        />
                        <button onClick={() => addCourseToTeacher(teacher.id)} className="bg-blue-500 text-white p-2">Add Course</button>
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
