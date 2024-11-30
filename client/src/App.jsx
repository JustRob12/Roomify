import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Login from './components/auth/Login'
import Register from './components/auth/Register'
import AdminDashboard from './components/dashboards/AdminDashboard'
import StudentDashboard from './components/dashboards/StudentDashboard'
import FacultyDashboard from './components/dashboards/FacultyDashboard'
import AdminSidebar from './components/sidebar/AdminSidebar'
import StudentSidebar from './components/sidebar/StudentSidebar'
import FacultySidebar from './components/sidebar/FacultySidebar'
import Header from './components/layout/Header'
import AddClassroom from './pages/admin/AddClassroom'
import AddSubject from './pages/admin/AddSubject'
import { SidebarProvider, useSidebar } from './context/SidebarContext'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user'));
      setIsAuthenticated(!!token);
      setUserRole(user?.role);
    };

    checkAuth();
    window.addEventListener('storage', checkAuth);
    
    return () => {
      window.removeEventListener('storage', checkAuth);
    };
  }, []);

  const PrivateRoute = ({ children }) => {
    return isAuthenticated ? children : <Navigate to="/login" />;
  };

  const DashboardLayout = ({ children }) => {
    let Sidebar;
    switch (userRole) {
      case 'Admin':
        Sidebar = AdminSidebar;
        break;
      case 'Student':
        Sidebar = StudentSidebar;
        break;
      case 'Faculty':
        Sidebar = FacultySidebar;
        break;
      default:
        return <Navigate to="/login" />;
    }

    const { isExpanded } = useSidebar();

    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="pt-16"> {/* Add padding top for header */}
          <Sidebar />
          <div className={`transition-all duration-300 ${isExpanded ? 'ml-64' : 'ml-20'} p-8`}>
            {children}
          </div>
        </div>
      </div>
    );
  };

  const AdminRoutes = () => (
    <Routes>
      <Route path="/" element={<AdminDashboard />} />
      <Route path="/admin/classrooms/add" element={<AddClassroom />} />
      <Route path="/admin/subjects/add" element={<AddSubject />} />
      <Route path="/admin/classrooms" element={
        <div>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Manage Classrooms</h1>
            <Link 
              to="/admin/classrooms/add" 
              className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
            >
              Add New Classroom
            </Link>
          </div>
          {/* Classroom list will go here */}
        </div>
      } />
      <Route path="/admin/subjects" element={
        <div>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Manage Subjects</h1>
            <Link 
              to="/admin/subjects/add" 
              className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
            >
              Add New Subject
            </Link>
          </div>
          {/* Subject list will go here */}
        </div>
      } />
    </Routes>
  );

  const StudentRoutes = () => (
    <Routes>
      <Route path="/" element={<StudentDashboard />} />
      <Route path="/student/subjects" element={<div><h1 className="text-2xl font-bold">My Subjects</h1></div>} />
      <Route path="/student/assignments" element={<div><h1 className="text-2xl font-bold">My Assignments</h1></div>} />
      <Route path="/student/grades" element={<div><h1 className="text-2xl font-bold">My Grades</h1></div>} />
    </Routes>
  );

  const FacultyRoutes = () => (
    <Routes>
      <Route path="/" element={<FacultyDashboard />} />
      <Route path="/faculty/classes" element={<div><h1 className="text-2xl font-bold">My Classes</h1></div>} />
      <Route path="/faculty/assignments" element={<div><h1 className="text-2xl font-bold">Assignments</h1></div>} />
      <Route path="/faculty/grades" element={<div><h1 className="text-2xl font-bold">Grade Book</h1></div>} />
    </Routes>
  );

  const RoleBasedRoutes = () => {
    switch (userRole) {
      case 'Admin':
        return <AdminRoutes />;
      case 'Student':
        return <StudentRoutes />;
      case 'Faculty':
        return <FacultyRoutes />;
      default:
        return <Navigate to="/login" />;
    }
  };

  return (
    <Router>
      <SidebarProvider>
        <Routes>
          <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Login />} />
          <Route path="/register" element={isAuthenticated ? <Navigate to="/" /> : <Register />} />
          <Route
            path="/*"
            element={
              <PrivateRoute>
                <DashboardLayout>
                  <RoleBasedRoutes />
                </DashboardLayout>
              </PrivateRoute>
            }
          />
        </Routes>
      </SidebarProvider>
    </Router>
  );
}

export default App;
