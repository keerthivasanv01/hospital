import React, { useState } from 'react';
import Navbar from '../sections/Navbar';
import '../css/Dashboard.css';

const Dashboard = () => {
  const [activePanel, setActivePanel] = useState('dashboard');
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [services, setServices] = useState([]);
  const [about, setAbout] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('');
  const [doctorForm, setDoctorForm] = useState({ name: '', specialization: '', email: '', phone: '' });
  const [editingDoctorId, setEditingDoctorId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [selectedDoctor, setSelectedDoctor] = useState(null); // State to hold the selected doctor's details
  const [showDoctorModal, setShowDoctorModal] = useState(false);
  const [isPublish, setIsPublish] = useState(true);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState(null);
  const [serviceForm, setServiceForm] = useState({
    service_name: '',
    Text: '',
    image: null,
    logo: null,
  });
  const [serviceImageFile, setServiceImageFile] = useState(null);
  const [serviceLogoFile, setServiceLogoFile] = useState(null);
  const [selectedService, setSelectedService] = useState(null); 
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768); 
  const [aboutPages, setAboutPages] = useState([]);
  const [loadingAboutPages, setLoadingAboutPages] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [loadingDepartments, setLoadingDepartments] = useState(false);
  const [departmentForm, setDepartmentForm] = useState({ DEPARTMENT: '', ICONS: null });
  const [editingDepartmentId, setEditingDepartmentId] = useState(null);
  const [showDepartmentModal, setShowDepartmentModal] = useState(false);
  const [servicePoints, setServicePoints] = useState([]); 
  const [serviceHomeData, setServiceHomeData] = useState([]);
  const [loadingServiceHome, setLoadingServiceHome] = useState(false);
  const [showServiceHomeModal, setShowServiceHomeModal] = useState(false);
  const [editingServiceHomeId, setEditingServiceHomeId] = useState(null);
  const [serviceHomeForm, setServiceHomeForm] = useState({
    heading: '',
    points: '',
    servicepara: '',
    sidepoints: '',
    service_image: [],
  });
  const [serviceHomeImageFiles, setServiceHomeImageFiles] = useState([]);
  const [serviceHomeError, setServiceHomeError] = useState('');

  const token = 'fa40f0050afb80032281d4a649ba1a6645c4b9b16d7d9af65a63611fcc66d7952bb0e920312d7eff18b7468ab736d364a55e83d885689bfe22f5e7d84da929786e1244f6c7554e186250ab4a03e34aa249a4f9233ab94bdc700be9cd5fe5ee22af8740a2cec2990100ff9dd6e6d26852c877674dbd6110193ce109af250dd0f7';

  const doctorApiEndpoint = 'https://cms-dev.seidrtech.ai/api/doctor-listings';
  const serviceApiEndpoint = 'https://cms-dev.seidrtech.ai/api/our-services1'; 
  const serviceHomeApiEndpoint = 'https://cms-dev.seidrtech.ai/api/service-lefts';
  const departmentApiEndpoint = 'https://cms-dev.seidrtech.ai/api/our-specialties1';

  // Handle window resize to auto-close sidebar on mobile
  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) setSidebarOpen(false);
      else setSidebarOpen(true);
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close sidebar when clicking outside (on mobile)
  React.useEffect(() => {
    if (!sidebarOpen || window.innerWidth > 768) return;
    const handleClick = (e) => {
      if (
        !e.target.closest('.dashboard-sidebar') &&
        !e.target.closest('.hamburger-button')
      ) {
        setSidebarOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [sidebarOpen]);

  const handleShowAppointments = async () => {
    setActivePanel('appointments');
    setLoading(true);
    setError('');
    try {
      const response = await fetch('https://devbeapi.lucknowheritagehospital.com/appointments');
      if (!response.ok) throw new Error('Failed to fetch appointments');
      const data = await response.json();
      setAppointments(data.data || []); // Use data.data from API response
    } catch (err) {
      setError('Could not load appointments.');
    }
    setLoading(false);
  };

  const handleShowDoctors = async () => {
    setActivePanel('doctors');
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${doctorApiEndpoint}?populate=*`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to fetch doctors');
      const data = await response.json();
      const formattedDoctors = data.data.map((item) => ({
        id: item.id,
        name: item.attributes.name,
        dept: item.attributes.dept,
        specialization: item.attributes.specialization,
        addProfileData: item.attributes.addprofiledata,
        viewProfile: item.attributes.viewprofile,
        doctorImage: item.attributes.doctorimage?.data?.attributes?.url
          ? item.attributes.doctorimage.data.attributes.url
          : null,
      }));
      setDoctors(formattedDoctors);
    } catch (err) {
      setError('Could not load doctors.');
      console.error(err);
      setDoctors([]);
    }
    setLoading(false);
  };

  // Fix service image/logo URLs in handleShowServices
  const handleShowServices = async () => {
    setActivePanel('services');
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${serviceApiEndpoint}?populate=*`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to fetch services');
      const data = await response.json();
      const formattedServices = data.data
        ? data.data.map((item) => {
            let imageUrl = null;
            const imgAttr = item.attributes.image?.data?.attributes;
            if (imgAttr?.formats?.thumbnail?.url) {
              imageUrl = imgAttr.formats.thumbnail.url;
            } else if (imgAttr?.formats?.small?.url) {
              imageUrl = imgAttr.formats.small.url;
            } else if (imgAttr?.formats?.medium?.url) {
              imageUrl = imgAttr.formats.medium.url;
            } else if (imgAttr?.formats?.large?.url) {
              imageUrl = imgAttr.formats.large.url;
            } else if (imgAttr?.url) {
              imageUrl = imgAttr.url;
            }
            let logoUrl = null;
            const logoArr = item.attributes.LOGO?.data;
            if (Array.isArray(logoArr) && logoArr.length > 0) {
              const logoAttr = logoArr[0].attributes;
              if (logoAttr.formats?.thumbnail?.url) {
                logoUrl = logoAttr.formats.thumbnail.url;
              } else if (logoAttr.formats?.small?.url) {
                logoUrl = logoAttr.formats.small.url;
              } else if (logoAttr.formats?.medium?.url) {
                logoUrl = logoAttr.formats.medium.url;
              } else if (logoAttr.formats?.large?.url) {
                logoUrl = logoAttr.formats.large.url;
              } else if (logoAttr.url) {
                logoUrl = logoAttr.url;
              }
            }
            return {
              id: item.id,
              createdAt: item.attributes.createdAt,
              updatedAt: item.attributes.updatedAt,
              publishedAt: item.attributes.publishedAt,
              service_name: item.attributes.service_name,
              Text: item.attributes.Text,
              image: imageUrl,
              logo: logoUrl,
            };
          })
        : [];
      setServices(formattedServices);
    } catch (err) {
      setError('Could not load services.');
      setServices([]);
    }
    setLoading(false);
  };

  const handleShowAbout = async () => {
    setActivePanel('about');
    setLoading(true);
    setError('');
    try {
      const response = await fetch('https://devbeapi.lucknowheritagehospital.com/about', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to fetch about info');
      const data = await response.text();
      setAbout(data);
    } catch (err) {
      setError('comming soon.');
    }
    setLoading(false);
  };

  const handleShowAboutPages = async () => {
    setActivePanel('aboutPages');
    setLoadingAboutPages(true);
    setError('');
    try {
      const response = await fetch('https://cms-dev.seidrtech.ai/api/about-pages?populate=*', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to fetch about pages');
      const data = await response.json();
      const formatted = data.data
        ? data.data.map(item => ({
            id: item.id,
            title: item.attributes.title,
            description: item.attributes.description,
            createdAt: item.attributes.createdAt,
            updatedAt: item.attributes.updatedAt,
            publishedAt: item.attributes.publishedAt,
            ...item.attributes
          }))
        : [];
      setAboutPages(formatted);
    } catch (err) {
      setError('Could not load about pages.');
      setAboutPages([]);
    }
    setLoadingAboutPages(false);
  };

  // Add Doctor
  const handleAddDoctor = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(doctorApiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(doctorForm)
      });
      if (response.ok) {
        const newDoctor = await response.json();
        setDoctors([...doctors, newDoctor]);
        setDoctorForm({ name: '', specialization: '', email: '', phone: '' });
      } else {
        setError('Failed to add doctor.');
      }
    } catch {
      setError('Could not add doctor.');
    }
  };

  // Edit Doctor
  const handleEditDoctor = (doctor) => {
    setEditingDoctorId(doctor.id);
    setDoctorForm({
      name: doctor.name,
      specialization: doctor.specialization,
      dept: doctor.dept,
      addProfileData: doctor.addProfileData,
      viewProfile: doctor.viewProfile,
    });
  };

  // Update Doctor
  const handleUpdateDoctor = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const updateData = {
        data: {
          name: doctorForm.name,
          specialization: doctorForm.specialization,
          dept: doctorForm.dept || '',
          addprofiledata: doctorForm.addProfileData || '',
          viewprofile: doctorForm.viewProfile || ''
        }
      };

      const response = await fetch(`${doctorApiEndpoint}/${editingDoctorId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Update error:', errorData);
        throw new Error(errorData.error?.message || 'Failed to update doctor');
      }

      const updatedDoctor = await response.json();
      setDoctors(doctors.map((doc) => 
        doc.id === editingDoctorId ? {
          ...doc,
          name: updatedDoctor.data.attributes.name,
          specialization: updatedDoctor.data.attributes.specialization,
          dept: updatedDoctor.data.attributes.dept,
          addProfileData: updatedDoctor.data.attributes.addprofiledata,
          viewProfile: updatedDoctor.data.attributes.viewprofile,
        } : doc
      ));
      
      // Reset form and editing state
      setEditingDoctorId(null);
      setDoctorForm({ 
        name: '', 
        specialization: '', 
        dept: '', 
        addProfileData: '', 
        viewProfile: '' 
      });
    } catch (err) {
      setError(err.message || 'Could not update doctor details.');
      console.error('Update error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Delete Doctor
  const handleDeleteDoctor = async (id) => {
    try {
      const response = await fetch(`${doctorApiEndpoint}/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` } // Add token
      });
      if (response.ok) {
        setDoctors(doctors.filter(doc => doc.id !== id && doc._id !== id));
      } else {
        setError('Failed to delete doctor.');
      }
    } catch {
      setError('Could not delete doctor.');
    }
  };

  const handleShowDoctorDetails = async (id) => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${doctorApiEndpoint}/${id}?populate=*`, {
        headers: { Authorization: `Bearer ${token}` } // Add token
      });
      if (!response.ok) throw new Error('Failed to fetch doctor details');
      const doctorDetails = await response.json();
      setSelectedDoctor({
        id: doctorDetails.data.id,
        name: doctorDetails.data.attributes.name,
        dept: doctorDetails.data.attributes.dept,
        specialization: doctorDetails.data.attributes.specialization,
        addProfileData: doctorDetails.data.attributes.addprofiledata,
        viewProfile: doctorDetails.data.attributes.viewprofile,
        doctorImage: doctorDetails.data.attributes.doctorimage?.data?.attributes?.url
          ? doctorDetails.data.attributes.doctorimage.data.attributes.url
          : null,
      });
    } catch (err) {
      setError('Could not load doctor details.');
      console.error(err);
    }
    setLoading(false);
  };

  const closeDoctorDetails = () => {
    setSelectedDoctor(null); 
  };

  // Pagination logic
  const filteredAppointments = appointments.filter(appt =>
    appt.name?.toLowerCase().includes(filter.toLowerCase()) ||
    appt.email?.toLowerCase().includes(filter.toLowerCase()) ||
    appt.department?.toLowerCase().includes(filter.toLowerCase())
  );
  const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage);
  const paginatedAppointments = filteredAppointments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle file drop
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setUploadedFile(file);
    }
  };

  // Handle file selection via input
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setUploadedFile(file);
    }
  };

  // Handle form submission
  const handleSubmitDoctor = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let imageId = null;
      
      // If there's a new image to upload
      if (uploadedFile) {
        const formData = new FormData();
        formData.append('files', uploadedFile);
        
        const uploadResponse = await fetch('https://cms-dev.seidrtech.ai/api/upload', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });
        
        if (!uploadResponse.ok) throw new Error('Failed to upload image');
        const uploadData = await uploadResponse.json();
        imageId = uploadData[0].id;
      }

      // Prepare the doctor data
      const doctorData = {
        data: {
          name: doctorForm.name,
          dept: doctorForm.dept,
          specialization: doctorForm.specialization,
          addprofiledata: doctorForm.addProfileData,
          viewprofile: doctorForm.viewProfile,
          publishedAt: isPublish ? new Date().toISOString() : null,
          ...(imageId && { doctorimage: imageId })
        }
      };

      let response;
      if (editingDoctorId) {
        // Update existing doctor
        response = await fetch(`${doctorApiEndpoint}/${editingDoctorId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(doctorData),
        });
      } else {
        // Create new doctor
        response = await fetch(doctorApiEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(doctorData),
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to save doctor');
      }

      // Refresh doctors list
      await handleShowDoctors();
      // Close modal and reset form
      setShowDoctorModal(false);
      setUploadedFile(null);
      setDoctorForm({
        name: '',
        specialization: '',
        dept: '',
        addProfileData: '',
        viewProfile: ''
      });
    } catch (err) {
      setError(err.message || 'Failed to save doctor');
      console.error('Error saving doctor:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle edit button click
  const handleEditClick = (doctor) => {
    setEditingDoctorId(doctor.id);
    setDoctorForm({
      name: doctor.name,
      specialization: doctor.specialization,
      dept: doctor.dept || '',
      addProfileData: doctor.addProfileData || '',
      viewProfile: doctor.viewProfile || ''
    });
    setShowDoctorModal(true);
  };

  // Service CRUD operations
  const handleDeleteService = async (id) => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${serviceApiEndpoint}/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to delete service');
      setServices(services.filter(srv => srv.id !== id));
    } catch (err) {
      setError('Could not delete service.');
    }
    setLoading(false);
  };

  const handleEditService = (service) => {
    setEditingServiceId(service.id);
    setServiceForm({
      service_name: service.service_name || '',
      Text: service.Text || '',
      image: service.image || null,
      logo: service.logo || null,
    });
    setServiceImageFile(null);
    setServiceLogoFile(null);
    setShowServiceModal(true);
  };

  const handleAddService = () => {
    setEditingServiceId(null);
    setServiceForm({
      service_name: '',
      Text: '',
      image: null,
      logo: null,
    });
    setServiceImageFile(null);
    setServiceLogoFile(null);
    setShowServiceModal(true);
  };

  const handleServiceImageSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setServiceImageFile(file);
    }
  };

  const handleServiceLogoSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setServiceLogoFile(file);
    }
  };

  // Service Add/Edit Modal: CRUD for points in Text field
  React.useEffect(() => {
    setServicePoints(
      serviceForm.Text
        ? serviceForm.Text.split('\n').map((pt) => pt.trim()).filter((pt) => pt)
        : []
    );
  }, [serviceForm.Text, showServiceModal]);

  const handleAddPoint = () => {
    setServicePoints([...servicePoints, '']);
  };
  const handleEditPoint = (idx, value) => {
    const updated = [...servicePoints];
    updated[idx] = value;
    setServicePoints(updated);
  };
  const handleDeletePoint = (idx) => {
    const updated = [...servicePoints];
    updated.splice(idx, 1);
    setServicePoints(updated);
  };

  const handleSubmitService = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      let imageId = null;
      let logoId = null;

      // Upload image if selected
      if (serviceImageFile) {
        const formData = new FormData();
        formData.append('files', serviceImageFile);
        const uploadRes = await fetch('https://cms-dev.seidrtech.ai/api/upload', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });
        if (!uploadRes.ok) throw new Error('Failed to upload image');
        const uploadData = await uploadRes.json();
        imageId = uploadData[0].id;
      }

      // Upload logo if selected
      if (serviceLogoFile) {
        const formData = new FormData();
        formData.append('files', serviceLogoFile);
        const uploadRes = await fetch('https://cms-dev.seidrtech.ai/api/upload', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });
        if (!uploadRes.ok) throw new Error('Failed to upload logo');
        const uploadData = await uploadRes.json();
        logoId = uploadData[0].id;
      }

      // Prepare service data
      const serviceData = {
        data: {
          service_name: serviceForm.service_name,
          Text: servicePoints.join('\n'),
          ...(imageId && { image: imageId }),
          ...(logoId && { LOGO: [logoId] }),
          publishedAt: new Date().toISOString(),
        }
      };

      let response;
      if (editingServiceId) {
        response = await fetch(`${serviceApiEndpoint}/${editingServiceId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(serviceData),
        });
      } else {
        response = await fetch(serviceApiEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(serviceData),
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to save service');
      }

      await handleShowServices();
      setShowServiceModal(false);
      setServiceImageFile(null);
      setServiceLogoFile(null);
      setServiceForm({
        service_name: '',
        Text: '',
        image: null,
        logo: null,
      });
    } catch (err) {
      setError(err.message || 'Failed to save service');
    } finally {
      setLoading(false);
    }
  };

  const handleViewService = (service) => {
    setSelectedService(service);
  };

  const closeServiceDetails = () => {
    setSelectedService(null);
  };

  // Department CRUD
  const handleShowDepartments = async () => {
    setActivePanel('departments');
    setLoadingDepartments(true);
    setError('');
    try {
      const response = await fetch(`${departmentApiEndpoint}?populate=*`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to fetch departments');
      const data = await response.json();
      const formattedDepartments = data.data
        ? data.data.map((item) => ({
            id: item.id,
            DEPARTMENT: item.attributes.DEPARTMENT,
            ICONS: Array.isArray(item.attributes.ICONS?.data) && item.attributes.ICONS.data.length > 0
              ? item.attributes.ICONS.data[0].attributes.url
              : null,
            createdAt: item.attributes.createdAt,
            updatedAt: item.attributes.updatedAt,
            publishedAt: item.attributes.publishedAt,
          }))
        : [];
      setDepartments(formattedDepartments);
    } catch (err) {
      setError('Could not load departments.');
      setDepartments([]);
    }
    setLoadingDepartments(false);
  };

  const handleAddDepartment = () => {
    setEditingDepartmentId(null);
    setDepartmentForm({ DEPARTMENT: '', ICONS: null });
    setShowDepartmentModal(true);
  };

  const handleEditDepartment = (dept) => {
    setEditingDepartmentId(dept.id);
    setDepartmentForm({ DEPARTMENT: dept.DEPARTMENT, ICONS: null });
    setShowDepartmentModal(true);
  };

  const handleDeleteDepartment = async (id) => {
    setLoadingDepartments(true);
    setError('');
    try {
      const response = await fetch(`${departmentApiEndpoint}/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to delete department');
      setDepartments(departments.filter(d => d.id !== id));
    } catch (err) {
      setError('Could not delete department.');
    }
    setLoadingDepartments(false);
  };

  const handleDepartmentIconSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setDepartmentForm((prev) => ({ ...prev, ICONS: file }));
    }
  };

  const handleSubmitDepartment = async (e) => {
    e.preventDefault();
    setLoadingDepartments(true);
    setError('');
    try {
      let iconId = null;
      if (departmentForm.ICONS) {
        const formData = new FormData();
        formData.append('files', departmentForm.ICONS);
        const uploadRes = await fetch('https://cms-dev.seidrtech.ai/api/upload', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });
        if (!uploadRes.ok) throw new Error('Failed to upload icon');
        const uploadData = await uploadRes.json();
        iconId = uploadData[0].id;
      }
      const deptData = {
        data: {
          DEPARTMENT: departmentForm.DEPARTMENT,
          ...(iconId && { ICONS: [iconId] }),
          publishedAt: new Date().toISOString(),
        }
      };
      let response;
      if (editingDepartmentId) {
        response = await fetch(`${departmentApiEndpoint}/${editingDepartmentId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(deptData),
        });
      } else {
        response = await fetch(departmentApiEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(deptData),
        });
      }
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to save department');
      }
      await handleShowDepartments();
      setShowDepartmentModal(false);
      setDepartmentForm({ DEPARTMENT: '', ICONS: null });
    } catch (err) {
      setError(err.message || 'Failed to save department');
    } finally {
      setLoadingDepartments(false);
    }
  };

  // Service Home CRUD
  const handleShowServiceHome = async () => {
    setActivePanel('serviceHome');
    setLoadingServiceHome(true);
    setServiceHomeError('');
    try {
      const response = await fetch(`${serviceHomeApiEndpoint}?populate=*`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to fetch service home');
      const data = await response.json();
      // Format response
      const formatted = data.data
        ? data.data.map(item => ({
            id: item.id,
            heading: item.attributes.heading,
            points: item.attributes.points,
            servicepara: item.attributes.servicepara,
            sidepoints: Array.isArray(item.attributes.sidepoints)
              ? item.attributes.sidepoints.map(pt =>
                  pt.children?.map(child => child.text).join(' ')
                ).join('\n')
              : '',
            service_image: Array.isArray(item.attributes.service_image?.data)
              ? item.attributes.service_image.data.map(img =>
                  img.attributes.formats?.thumbnail?.url
                    ? img.attributes.formats.thumbnail.url
                    : img.attributes.url
                )
              : [],
            createdAt: item.attributes.createdAt,
            updatedAt: item.attributes.updatedAt,
            publishedAt: item.attributes.publishedAt,
          }))
        : [];
      setServiceHomeData(formatted);
    } catch (err) {
      setServiceHomeError('Could not load service home.');
      setServiceHomeData([]);
    }
    setLoadingServiceHome(false);
  };

  const handleAddServiceHome = () => {
    setEditingServiceHomeId(null);
    setServiceHomeForm({
      heading: '',
      points: '',
      servicepara: '',
      sidepoints: '',
      service_image: [],
    });
    setServiceHomeImageFiles([]);
    setShowServiceHomeModal(true);
  };

  const handleEditServiceHome = (item) => {
    setEditingServiceHomeId(item.id);
    setServiceHomeForm({
      heading: item.heading || '',
      points: item.points || '',
      servicepara: item.servicepara || '',
      sidepoints: item.sidepoints || '',
      service_image: item.service_image || [],
    });
    setServiceHomeImageFiles([]);
    setShowServiceHomeModal(true);
  };

  const handleDeleteServiceHome = async (id) => {
    setLoadingServiceHome(true);
    setServiceHomeError('');
    try {
      const response = await fetch(`${serviceHomeApiEndpoint}/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to delete');
      setServiceHomeData(serviceHomeData.filter(d => d.id !== id));
    } catch (err) {
      setServiceHomeError('Could not delete.');
    }
    setLoadingServiceHome(false);
  };

  const handleServiceHomeImageSelect = (e) => {
    setServiceHomeImageFiles(Array.from(e.target.files));
  };

  const handleSubmitServiceHome = async (e) => {
    e.preventDefault();
    setLoadingServiceHome(true);
    setServiceHomeError('');
    try {
      let imageIds = [];
      // Upload images if selected
      if (serviceHomeImageFiles.length > 0) {
        const formData = new FormData();
        serviceHomeImageFiles.forEach(file => formData.append('files', file));
        const uploadRes = await fetch('https://cms-dev.seidrtech.ai/api/upload', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });
        if (!uploadRes.ok) throw new Error('Failed to upload images');
        const uploadData = await uploadRes.json();
        imageIds = uploadData.map(img => img.id);
      }
      // Prepare sidepoints as array of paragraphs
      const sidepointsArr = serviceHomeForm.sidepoints
        ? serviceHomeForm.sidepoints.split('\n').map(pt => ({
            type: 'paragraph',
            children: [{ type: 'text', text: pt }]
          }))
        : [];
      const payload = {
        data: {
          heading: serviceHomeForm.heading,
          points: serviceHomeForm.points,
          servicepara: serviceHomeForm.servicepara,
          sidepoints: sidepointsArr,
          ...(imageIds.length > 0 && { service_image: imageIds }),
          publishedAt: new Date().toISOString(),
        }
      };
      let response;
      if (editingServiceHomeId) {
        response = await fetch(`${serviceHomeApiEndpoint}/${editingServiceHomeId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
      } else {
        response = await fetch(serviceHomeApiEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
      }
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to save');
      }
      await handleShowServiceHome();
      setShowServiceHomeModal(false);
      setServiceHomeImageFiles([]);
      setServiceHomeForm({
        heading: '',
        points: '',
        servicepara: '',
        sidepoints: '',
        service_image: [],
      });
    } catch (err) {
      setServiceHomeError(err.message || 'Failed to save');
    } finally {
      setLoadingServiceHome(false);
    }
  };

  // Helper to close sidebar on mobile after menu click
  const handleSidebarMenuClick = (action) => {
    action();
    if (window.innerWidth <= 768) setSidebarOpen(false);
  };

  return (
    <div className="dashboard-page" style={{ height: '100%', position: 'relative' }}>
      <Navbar />
      {/* Hamburger Button - must be here, outside dashboard-layout */}
      <button
        className="hamburger-button"
        aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
        onClick={() => setSidebarOpen((open) => !open)}
        style={{ zIndex: 2000, display: 'block', color: '#000000' }}
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="black" style={{ position: 'absolute', top: '75px', right: '-10px' }}>
          <rect x="4" y="6" width="16" height="2" rx="1"/>
          <rect x="4" y="11" width="16" height="2" rx="1"/>
          <rect x="4" y="16" width="16" height="2" rx="1"/>
        </svg>
      </button>
      <div className="dashboard-layout">
        <aside className={`dashboard-sidebar${sidebarOpen ? ' open' : ' closed'}`}>
          <h3 style={{ color: '#e5e7eb', position: 'relative', left: '50px'}}>Menu</h3>
          <ul>
            <li>
              <button
                className="sidebar-link"
                style={{ background: 'none', border: 'none', padding: 0, width: '100%', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                onClick={() => handleSidebarMenuClick(handleShowAppointments)}
              >
                {/* Calendar Icon */}
                <svg width="20" height="20" fill="white" viewBox="0 0 24 24"><path d="M7 10h2v2H7zm4 0h2v2h-2zm4 0h2v2h-2z"/><path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11zm0-13H5V6h14v1z"/></svg>
                Appointment
              </button>
            </li>
            <li>
              <button
                className="sidebar-link"
                style={{ background: 'none', border: 'none', padding: 0, width: '100%', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                onClick={() => handleSidebarMenuClick(handleShowDoctors)}
              >
                {/* Doctor Icon */}
                <svg width="20" height="20" fill="white" viewBox="0 0 24 24"><path d="M12 12c2.7 0 8 1.34 8 4v4H4v-4c0-2.66 5.3-4 8-4zm0-2a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"/></svg>
                Doctors
              </button>
            </li>
            <li>
              <button
                className="sidebar-link"
                style={{ background: 'none', border: 'none', padding: 0, width: '100%', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                onClick={() => handleSidebarMenuClick(handleShowServices)}
              >
                {/* Services Icon */}
                <svg width="20" height="20" fill="white" viewBox="0 0 24 24"><path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8v-10h-8v10zm0-18v6h8V3h-8z"/></svg>
                Services
              </button>
            </li>
            <li>
              <button
                className="sidebar-link"
                style={{ background: 'none', border: 'none', padding: 0, width: '100%', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                onClick={() => handleSidebarMenuClick(handleShowDepartments)}
              >
                {/* Department Icon */}
                <svg width="20" height="20" fill="#2563eb" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#e5e7eb"/><path d="M8 12h8M12 8v8" stroke="#2563eb" strokeWidth="2" strokeLinecap="round"/></svg>
                Department
              </button>
            </li>
            <li>
              <button
                className="sidebar-link"
                style={{ background: 'none', border: 'none', padding: 0, width: '100%', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                onClick={() => handleSidebarMenuClick(handleShowAbout)}
              >
                {/* Info Icon */}
                <svg width="20" height="20" fill="#2563eb" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#e5e7eb"/><path d="M12 16v-4m0-4h.01" stroke="#2563eb" strokeWidth="2" strokeLinecap="round"/></svg>
                About Us
              </button>
            </li>
            
            {/* New sidebar options */}
            <li>
              <button
                className={`sidebar-link ${activePanel === 'specialization' ? 'active' : ''}`}
                onClick={() => handleSidebarMenuClick(() => setActivePanel('specialization'))}
                style={{ background: 'none', border: 'none', padding: 0, width: '100%', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                {/* Stethoscope Icon */}
                <svg width="20" height="20" fill="#fff" viewBox="0 0 24 24">
                  <path d="M6 3v7a6 6 0 0 0 12 0V3h-2v7a4 4 0 0 1-8 0V3H6zm6 18a3 3 0 0 1-3-3h2a1 1 0 1 0 2 0h2a3 3 0 0 1-3 3z"/>
                </svg>
                Specialization
              </button>
            </li>
            <li>
              <button
                className={`sidebar-link ${activePanel === 'contact' ? 'active' : ''}`}
                onClick={() => handleSidebarMenuClick(() => setActivePanel('contact'))}
                style={{ background: 'none', border: 'none', padding: 0, width: '100%', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                {/* Phone Icon */}
                <svg width="20" height="20" fill="#fff" viewBox="0 0 24 24">
                  <path d="M6.62 10.79a15.053 15.053 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.11-.21c1.21.49 2.53.76 3.88.76a1 1 0 0 1 1 1v3.5a1 1 0 0 1-1 1C7.61 22 2 16.39 2 9.5a1 1 0 0 1 1-1H6.5a1 1 0 0 1 1 1c0 1.35.27 2.67.76 3.88a1 1 0 0 1-.21 1.11l-2.2 2.2z"/>
                </svg>
                Contact
              </button>
            </li>
            <li>
              <button
                className={`sidebar-link ${activePanel === 'footer' ? 'active' : ''}`}
                onClick={() => handleSidebarMenuClick(() => setActivePanel('footer'))}
                style={{ background: 'none', border: 'none', padding: 0, width: '100%', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                {/* Footer Icon (shoe print) */}
                <svg width="20" height="20" fill="#fff" viewBox="0 0 24 24">
                  <path d="M7 21c-1.1 0-2-.9-2-2v-2h2v2h10v-2h2v2c0 1.1-.9 2-2 2H7zm5-18c-1.1 0-2 .9-2 2v2h2V5h6v2h2V5c0-1.1-.9-2-2-2h-6z"/>
                </svg>
                Footer
              </button>
            </li>
            <li>
              <button
                className={`sidebar-link ${activePanel === 'department' ? 'active' : ''}`}
                onClick={() => handleSidebarMenuClick(() => setActivePanel('department'))}
                style={{ background: 'none', border: 'none', padding: 0, width: '100%', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                {/* Building Icon */}
                <svg width="20" height="20" fill="#fff" viewBox="0 0 24 24">
                  <path d="M3 21v-9a1 1 0 0 1 1-1h2V3h10v8h2a1 1 0 0 1 1 1v9h-2v-7h-2v7h-2v-7h-2v7H3z"/>
                </svg>
                Department
              </button>
            </li>
            <li>
              <button
                className={`sidebar-link ${activePanel === 'news' ? 'active' : ''}`}
                onClick={() => handleSidebarMenuClick(() => setActivePanel('news'))}
                style={{ background: 'none', border: 'none', padding: 0, width: '100%', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                {/* Newspaper Icon */}
                <svg width="20" height="20" fill="#fff" viewBox="0 0 24 24">
                  <rect x="3" y="4" width="18" height="16" rx="2" fill="#fff" stroke="#2563eb" strokeWidth="1"/>
                  <rect x="7" y="8" width="10" height="2" fill="#2563eb"/>
                  <rect x="7" y="12" width="6" height="2" fill="#2563eb"/>
                </svg>
                News
              </button>
            </li>

            <hr />

            <li>
              <button
                className={`sidebar-link ${activePanel === 'outPatients' ? 'active' : ''}`}
                onClick={() => handleSidebarMenuClick(() => setActivePanel('outPatients'))}
                style={{ background: 'none', border: 'none', padding: 0, width: '100%', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <i className="fas fa-user"></i> Out Patients
              </button>
            </li>
            <li>
              <button
                className={`sidebar-link ${activePanel === 'inPatients' ? 'active' : ''}`}
                onClick={() => handleSidebarMenuClick(() => setActivePanel('inPatients'))}
                style={{ background: 'none', border: 'none', padding: 0, width: '100%', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <i className="fas fa-procedures"></i> In Patients
              </button>
            </li>
            <li>
              <button
                className={`sidebar-link ${activePanel === 'registerInPatients' ? 'active' : ''}`}
                onClick={() => handleSidebarMenuClick(() => setActivePanel('registerInPatients'))}
                style={{ background: 'none', border: 'none', padding: 0, width: '100%', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <i className="fas fa-user-plus"></i> Register In Patients
              </button>
            </li>
          </ul>
        </aside>
        <main className="dashboard-container">
          {activePanel === 'appointments' ? (
            <div>
              <h2>Booked Appointments</h2>
              <input
                type="text"
                placeholder="Filter by name, email, or department"
                value={filter}
                onChange={e => { setFilter(e.target.value); setCurrentPage(1); }}
                style={{
                  marginBottom: '18px',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  width: '100%',
                  maxWidth: '350px'
                }}
              />
              {loading && <p>Loading...</p>}
              {error && <p style={{ color: 'red' }}>{error}</p>}
              {!loading && !error && (
                <>
                  <div className="table-responsive">
                    <table className="appointments-table">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Age</th> 
                          <th>Gender</th>
                          <th>Email</th>
                          <th>Phone</th>
                          <th>Date</th>
                          <th>Time</th> 
                          <th>Department</th>
                          <th>Doctor</th>
                          <th>Message</th>
                        
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedAppointments.length === 0 ? (
                          <tr>
                            <td colSpan="10">No appointments found.</td> {/* Updated colspan */}
                          </tr>
                        ) : (
                          paginatedAppointments.map((appt, idx) => (
                            <tr key={idx}>
                              <td>{appt.name}</td>
                              <td>{appt.age}</td>
                              <td>{appt.gender}</td>
                              <td>{appt.email}</td>
                              <td>{appt.phone}</td>
                              <td>{appt.appointmentDate}</td>
                              <td>{appt.appointmentTime}</td> {/* Added missing field */}
                              <td>{appt.department}</td>
                              <td>{appt.doctor}</td>
                              <td>{appt.message}</td>
                              
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                  {/* Pagination Controls */}
                  {totalPages > 1 && (
                    <div style={{ marginTop: '16px', textAlign: 'center' }}>
                      <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        style={{ marginRight: 8, padding: '4px 10px' }}
                      >
                        Prev
                      </button>
                      {Array.from({ length: totalPages }, (_, i) => (
                        <button
                          key={i + 1}
                          onClick={() => setCurrentPage(i + 1)}
                          style={{
                            margin: '0 2px',
                            padding: '4px 10px',
                            background: currentPage === i + 1 ? '#2563eb' : '#e5e7eb',
                            color: currentPage === i + 1 ? '#fff' : '#222',
                            border: 'none',
                            borderRadius: '4px'
                          }}
                        >
                          {i + 1}
                        </button>
                      ))}
                      <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        style={{ marginLeft: 8, padding: '4px 10px' }}
                      >
                        Next
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          ) : activePanel === 'doctors' ? (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ margin: 0 }}>Doctors</h2>
                <button
                  onClick={() => {
                    setEditingDoctorId(null);
                    setDoctorForm({
                      name: '',
                      specialization: '',
                      dept: '',
                      addProfileData: '',
                      viewProfile: ''
                    });
                    setUploadedFile(null);
                    setShowDoctorModal(true);
                  }}
                  style={{
                    backgroundColor: '#1F2B6C',
                    color: 'white',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontWeight: '500',
                    fontSize: '14px'
                  }}
                >
                  <span>+</span> Add New Doctor
                </button>
              </div>
              {/* Doctors Table */}
              {loading && <p>Loading...</p>}
              {error && <p style={{ color: 'red' }}>{error}</p>}
              {!loading && !error && (
                <div className="table-responsive">
                  <table className="appointments-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Department</th>
                        <th>Specialization</th>
                        <th>Profile Data</th>
                        <th>Image</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {doctors.length === 0 ? (
                        <tr>
                          <td colSpan="6">No doctors found.</td>
                        </tr>
                      ) : (
                        doctors.map((doc, idx) => (
                          <tr key={doc.id || idx}>
                            <td>{doc.name}</td>
                            <td>{doc.dept}</td>
                            <td>{doc.specialization}</td>
                            <td>{doc.addProfileData}</td>
                            <td>
                              {doc.doctorImage ? (
                                <img
                                  src={doc.doctorImage}
                                  alt={doc.name}
                                  style={{ width: '50px', height: '50px', borderRadius: '50%' }}
                                />
                              ) : (
                                'No Image'
                              )}
                            </td>
                            <td>
                              <button
                                style={{
                                  width: '80px',
                                  height: '32px',
                                  padding: '0 10px',
                                  background: '#2563eb',
                                  color: '#fff',
                                  border: 'none',
                                  borderRadius: '4px',
                                  fontSize: '14px',
                                  fontWeight: 500,
                                  cursor: 'pointer',
                                  marginRight: '8px',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  justifyContent: 'center'
                                }}
                                onClick={() => handleEditDoctor(doc)}
                              >
                                Edit
                              </button>
                              <button
                                style={{
                                  width: '80px',
                                  height: '32px',
                                  padding: '0 10px',
                                  background: '#4caf50',
                                  color: '#fff',
                                  border: 'none',
                                  borderRadius: '4px',
                                  fontSize: '14px',
                                  fontWeight: 500,
                                  cursor: 'pointer',
                                  marginRight: '8px',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  justifyContent: 'center'
                                }}
                                onClick={() => handleShowDoctorDetails(doc.id)}
                              >
                                View
                              </button>
                              <button
                                style={{
                                  width: '80px',
                                  height: '32px',
                                  padding: '0 10px',
                                  background: '#e53e3e',
                                  color: '#fff',
                                  border: 'none',
                                  borderRadius: '4px',
                                  fontSize: '14px',
                                  fontWeight: 500,
                                  cursor: 'pointer',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  justifyContent: 'center'
                                }}
                                onClick={() => handleDeleteDoctor(doc.id)}
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ) : activePanel === 'services' ? (
            <div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px',
                padding: '8px 0'
              }}>
                <h2 style={{ margin: 0, color: '#1F2B6C', fontWeight: 700, fontSize: '1.7rem' }}>Services</h2>
                <button
                  onClick={handleAddService}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '0 8px',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                  title="Add New Service"
                >
                  {/* Add Icon */}
                  <svg width="32" height="32" fill="#1F2B6C" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" fill="#e5e7eb"/>
                    <path d="M12 8v8M8 12h8" stroke="#1F2B6C" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  <span style={{ marginLeft: '8px', color: '#1F2B6C', fontWeight: 600, fontSize: '16px' }}>Add New Service</span>
                </button>
              </div>
              {loading && <p>Loading...</p>}
              {error && <p style={{ color: 'red' }}>{error}</p>}
              {!loading && !error && (
                <div style={{
                  background: '#f9fafb',
                  borderRadius: '10px',
                  boxShadow: '0 2px 8px rgba(31,43,108,0.07)',
                  padding: '18px',
                  overflowX: 'auto'
                }}>
                  <div className="table-responsive">
                    <table className="appointments-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '15px' }}>
                      <thead style={{ background: '#1F2B6C', color: '#fff' }}>
                        <tr>
                          <th style={{ padding: '10px' }}>ID</th>
                          <th style={{ padding: '10px' }}>Service Name</th>
                          <th style={{ padding: '10px' }}>Description</th>
                          <th style={{ padding: '10px' }}>Image</th>
                          <th style={{ padding: '10px' }}>Logo</th>
                          <th style={{ padding: '10px' }}>Created At</th>
                          <th style={{ padding: '10px' }}>Updated At</th>
                          <th style={{ padding: '10px' }}>Published At</th>
                          <th style={{ padding: '10px' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {services.length === 0 ? (
                          <tr>
                            <td colSpan="9" style={{ textAlign: 'center', padding: '18px' }}>No services found.</td>
                          </tr>
                        ) : (
                          services.map((srv) => (
                            <tr key={srv.id} style={{ background: '#fff', borderBottom: '1px solid #e5e7eb' }}>
                              <td style={{ padding: '10px', fontWeight: 500 }}>{srv.id}</td>
                              <td style={{ padding: '10px', fontWeight: 500 }}>{srv.service_name}</td>
                              <td style={{ padding: '10px', maxWidth: '250px', whiteSpace: 'pre-line' }}>{srv.Text}</td>
                              <td style={{ padding: '10px' }}>
                                {srv.image ? (
                                  <img src={srv.image} alt="Service" style={{ width: '60px', height: '40px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #e5e7eb' }} />
                                ) : <span style={{ color: '#888' }}>No Image</span>}
                              </td>
                              <td style={{ padding: '10px' }}>
                                {srv.logo ? (
                                  <img src={srv.logo} alt="Logo" style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #e5e7eb' }} />
                                ) : <span style={{ color: '#888' }}>No Logo</span>}
                              </td>
                              <td style={{ padding: '10px' }}>{srv.createdAt ? new Date(srv.createdAt).toLocaleString() : ''}</td>
                              <td style={{ padding: '10px' }}>{srv.updatedAt ? new Date(srv.updatedAt).toLocaleString() : ''}</td>
                              <td style={{ padding: '10px' }}>{srv.publishedAt ? new Date(srv.publishedAt).toLocaleString() : ''}</td>
                              <td style={{ padding: '10px', display: 'flex', gap: '8px' }}>
                                {/* View Icon */}
                                <button
                                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                                  title="View"
                                  onClick={() => handleViewService(srv)}
                                >
                                  <svg width="22" height="22" fill="#2563eb" viewBox="0 0 24 24">
                                    <path d="M12 5c-7 0-10 7-10 7s3 7 10 7 10-7 10-7-3-7-10-7zm0 12a5 5 0 1 1 0-10 5 5 0 0 1 0 10zm0-8a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"/>
                                  </svg>
                                </button>
                                {/* Edit Icon */}
                                <button
                                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                                  title="Edit"
                                  onClick={() => handleEditService(srv)}
                                >
                                  <svg width="22" height="22" fill="#4caf50" viewBox="0 0 24 24">
                                    <path d="M3 17.25V21h3.75l11.06-11.06-3.75-3.75L3 17.25zm14.71-10.04a1.003 1.003 0 0 0 0-1.42l-2.5-2.5a1.003 1.003 0 0 0-1.42 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                                  </svg>
                                </button>
                                {/* Delete Icon */}
                                <button
                                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                                  title="Delete"
                                  onClick={() => handleDeleteService(srv.id)}
                                >
                                  <svg width="22" height="22" fill="#e53e3e" viewBox="0 0 24 24">
                                    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                                  </svg>
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          ) : activePanel === 'about' ? (
            <div>
              <h2>About Us</h2>
              {loading && <p>Loading...</p>}
              {error && <p style={{ color: 'red' }}>{error}</p>}
              {!loading && !error && (
                <div>{about || 'No about info found.'}</div>
              )}
            </div>
          ) : activePanel === 'aboutPages' ? (
            <div>
              <h2>About Pages</h2>
              {loadingAboutPages && <p>Loading...</p>}
              {error && <p style={{ color: 'red' }}>{error}</p>}
              {!loadingAboutPages && !error && (
                <div className="table-responsive">
                  <table className="appointments-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Created At</th>
                        <th>Updated At</th>
                        <th>Published At</th>
                      </tr>
                    </thead>
                    <tbody>
                      {aboutPages.length === 0 ? (
                        <tr>
                          <td colSpan="6" style={{ textAlign: 'center' }}>No about pages found.</td>
                        </tr>
                      ) : (
                        aboutPages.map(page => (
                          <tr key={page.id}>
                            <td>{page.id}</td>
                            <td>{page.title}</td>
                            <td style={{ maxWidth: '350px', whiteSpace: 'pre-line' }}>{page.description}</td>
                            <td>{page.createdAt ? new Date(page.createdAt).toLocaleString() : ''}</td>
                            <td>{page.updatedAt ? new Date(page.updatedAt).toLocaleString() : ''}</td>
                            <td>{page.publishedAt ? new Date(page.publishedAt).toLocaleString() : ''}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ) : activePanel === 'departments' ? (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ margin: 0, color: '#1F2B6C', fontWeight: 700, fontSize: '1.7rem' }}>Departments</h2>
                <button
                  onClick={handleAddDepartment}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '0 8px',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                  title="Add New Department"
                >
                  <svg width="32" height="32" fill="#1F2B6C" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" fill="#e5e7eb"/>
                    <path d="M12 8v8M8 12h8" stroke="#1F2B6C" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  <span style={{ marginLeft: '8px', color: '#1F2B6C', fontWeight: 600, fontSize: '16px' }}>Add New Department</span>
                </button>
              </div>
              {loadingDepartments && <p>Loading...</p>}
              {error && <p style={{ color: 'red' }}>{error}</p>}
              {!loadingDepartments && !error && (
                <div style={{
                  background: '#f9fafb',
                  borderRadius: '10px',
                  boxShadow: '0 2px 8px rgba(31,43,108,0.07)',
                  padding: '18px',
                  overflowX: 'auto'
                }}>
                  <div className="table-responsive">
                    <table className="appointments-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '15px' }}>
                      <thead style={{ background: '#1F2B6C', color: '#fff' }}>
                        <tr>
                          <th style={{ padding: '10px' }}>ID</th>
                          <th style={{ padding: '10px' }}>Department</th>
                          <th style={{ padding: '10px' }}>Icon</th>
                          <th style={{ padding: '10px' }}>Created At</th>
                          <th style={{ padding: '10px' }}>Updated At</th>
                          <th style={{ padding: '10px' }}>Published At</th>
                          <th style={{ padding: '10px' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {departments.length === 0 ? (
                          <tr>
                            <td colSpan="7" style={{ textAlign: 'center', padding: '18px' }}>No departments found.</td>
                          </tr>
                        ) : (
                          departments.map((dept) => (
                            <tr key={dept.id} style={{ background: '#fff', borderBottom: '1px solid #e5e7eb' }}>
                              <td style={{ padding: '10px', fontWeight: 500 }}>{dept.id}</td>
                              <td style={{ padding: '10px', fontWeight: 500 }}>{dept.DEPARTMENT}</td>
                              <td style={{ padding: '10px' }}>
                                {dept.ICONS ? (
                                  <img src={dept.ICONS} alt="Icon" style={{ width: '40px', height: '40px', borderRadius: '6px', border: '1px solid #e5e7eb', objectFit: 'contain' }} />
                                ) : <span style={{ color: '#888' }}>No Icon</span>}
                              </td>
                              <td style={{ padding: '10px' }}>{dept.createdAt ? new Date(dept.createdAt).toLocaleString() : ''}</td>
                              <td style={{ padding: '10px' }}>{dept.updatedAt ? new Date(dept.updatedAt).toLocaleString() : ''}</td>
                              <td style={{ padding: '10px' }}>{dept.publishedAt ? new Date(dept.publishedAt).toLocaleString() : ''}</td>
                              <td style={{ padding: '10px', display: 'flex', gap: '8px' }}>
                                <button
                                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                                  title="Edit"
                                  onClick={() => handleEditDepartment(dept)}
                                >
                                  <svg width="22" height="22" fill="#4caf50" viewBox="0 0 24 24">
                                    <path d="M3 17.25V21h3.75l11.06-11.06-3.75-3.75L3 17.25zm14.71-10.04a1.003 1.003 0 0 0 0-1.42l-2.5-2.5a1.003 1.003 0 0 0-1.42 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                                  </svg>
                                </button>
                                <button
                                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                                  title="Delete"
                                  onClick={() => handleDeleteDepartment(dept.id)}
                                >
                                  <svg width="22" height="22" fill="#e53e3e" viewBox="0 0 24 24">
                                    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                                  </svg>
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          ) : activePanel === 'serviceHome' ? (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ margin: 0, color: '#1F2B6C', fontWeight: 700, fontSize: '1.7rem' }}>Service Home Page</h2>
                <button
                  onClick={handleAddServiceHome}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '0 8px',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                  title="Add New Service Home"
                >
                  <svg width="32" height="32" fill="#1F2B6C" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" fill="#e5e7eb"/>
                    <path d="M12 8v8M8 12h8" stroke="#1F2B6C" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  <span style={{ marginLeft: '8px', color: '#1F2B6C', fontWeight: 600, fontSize: '16px' }}>Add New</span>
                </button>
              </div>
              {loadingServiceHome && <p>Loading...</p>}
              {serviceHomeError && <p style={{ color: 'red' }}>{serviceHomeError}</p>}
              {!loadingServiceHome && !serviceHomeError && (
                <div style={{
                  background: '#f9fafb',
                  borderRadius: '10px',
                  boxShadow: '0 2px 8px rgba(31,43,108,0.07)',
                  padding: '18px',
                  overflowX: 'auto'
                }}>
                  <div className="table-responsive">
                    <table className="appointments-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '15px' }}>
                      <thead style={{ background: '#1F2B6C', color: '#fff' }}>
                        <tr>
                          <th style={{ padding: '10px' }}>ID</th>
                          <th style={{ padding: '10px' }}>Heading</th>
                          <th style={{ padding: '10px' }}>Points</th>
                          <th style={{ padding: '10px' }}>Service Para</th>
                          <th style={{ padding: '10px' }}>Side Points</th>
                          <th style={{ padding: '10px' }}>Images</th>
                          <th style={{ padding: '10px' }}>Created At</th>
                          <th style={{ padding: '10px' }}>Updated At</th>
                          <th style={{ padding: '10px' }}>Published At</th>
                          <th style={{ padding: '10px' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {serviceHomeData.length === 0 ? (
                          <tr>
                            <td colSpan="10" style={{ textAlign: 'center', padding: '18px' }}>No data found.</td>
                          </tr>
                        ) : (
                          serviceHomeData.map((item) => (
                            <tr key={item.id} style={{ background: '#fff', borderBottom: '1px solid #e5e7eb' }}>
                              <td style={{ padding: '10px', fontWeight: 500 }}>{item.id}</td>
                              <td style={{ padding: '10px', fontWeight: 500 }}>{item.heading}</td>
                              <td style={{ padding: '10px', whiteSpace: 'pre-line' }}>{item.points}</td>
                              <td style={{ padding: '10px', maxWidth: '250px', whiteSpace: 'pre-line' }}>{item.servicepara}</td>
                              <td style={{ padding: '10px', whiteSpace: 'pre-line' }}>{item.sidepoints}</td>
                              <td style={{ padding: '10px' }}>
                                {item.service_image && item.service_image.length > 0 ? (
                                  item.service_image.map((img, idx) => (
                                    <img key={idx} src={img.startsWith('http') ? img : `https://j8potcdn-dev.seidrtech.ai${img}`} alt="Service" style={{ width: '60px', height: '40px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #e5e7eb', marginRight: '4px' }} />
                                  ))
                                ) : <span style={{ color: '#888' }}>No Image</span>}
                              </td>
                              <td style={{ padding: '10px' }}>{item.createdAt ? new Date(item.createdAt).toLocaleString() : ''}</td>
                              <td style={{ padding: '10px' }}>{item.updatedAt ? new Date(item.updatedAt).toLocaleString() : ''}</td>
                              <td style={{ padding: '10px' }}>{item.publishedAt ? new Date(item.publishedAt).toLocaleString() : ''}</td>
                              <td style={{ padding: '10px', display: 'flex', gap: '8px' }}>
                                <button
                                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                                  title="Edit"
                                  onClick={() => handleEditServiceHome(item)}
                                >
                                  <svg width="22" height="22" fill="#4caf50" viewBox="0 0 24 24">
                                    <path d="M3 17.25V21h3.75l11.06-11.06-3.75-3.75L3 17.25zm14.71-10.04a1.003 1.003 0 0 0 0-1.42l-2.5-2.5a1.003 1.003 0 0 0-1.42 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                                  </svg>
                                </button>
                                <button
                                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                                  title="Delete"
                                  onClick={() => handleDeleteServiceHome(item.id)}
                                >
                                  <svg width="22" height="22" fill="#e53e3e" viewBox="0 0 24 24">
                                    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                                  </svg>
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          ) : activePanel === 'about' ? (
            <div>
              <h2>About Us</h2>
              {loading && <p>Loading...</p>}
              {error && <p style={{ color: 'red' }}>{error}</p>}
              {!loading && !error && (
                <div>{about || 'No about info found.'}</div>
              )}
            </div>
          ) : activePanel === 'aboutPages' ? (
            <div>
              <h2>About Pages</h2>
              {loadingAboutPages && <p>Loading...</p>}
              {error && <p style={{ color: 'red' }}>{error}</p>}
              {!loadingAboutPages && !error && (
                <div className="table-responsive">
                  <table className="appointments-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Created At</th>
                        <th>Updated At</th>
                        <th>Published At</th>
                      </tr>
                    </thead>
                    <tbody>
                      {aboutPages.length === 0 ? (
                        <tr>
                          <td colSpan="6" style={{ textAlign: 'center' }}>No about pages found.</td>
                        </tr>
                      ) : (
                        aboutPages.map(page => (
                          <tr key={page.id}>
                            <td>{page.id}</td>
                            <td>{page.title}</td>
                            <td style={{ maxWidth: '350px', whiteSpace: 'pre-line' }}>{page.description}</td>
                            <td>{page.createdAt ? new Date(page.createdAt).toLocaleString() : ''}</td>
                            <td>{page.updatedAt ? new Date(page.updatedAt).toLocaleString() : ''}</td>
                            <td>{page.publishedAt ? new Date(page.publishedAt).toLocaleString() : ''}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ) : activePanel === 'departments' ? (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ margin: 0, color: '#1F2B6C', fontWeight: 700, fontSize: '1.7rem' }}>Departments</h2>
                <button
                  onClick={handleAddDepartment}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '0 8px',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                  title="Add New Department"
                >
                  <svg width="32" height="32" fill="#1F2B6C" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" fill="#e5e7eb"/>
                    <path d="M12 8v8M8 12h8" stroke="#1F2B6C" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  <span style={{ marginLeft: '8px', color: '#1F2B6C', fontWeight: 600, fontSize: '16px' }}>Add New Department</span>
                </button>
              </div>
              {loadingDepartments && <p>Loading...</p>}
              {error && <p style={{ color: 'red' }}>{error}</p>}
              {!loadingDepartments && !error && (
                <div style={{
                  background: '#f9fafb',
                  borderRadius: '10px',
                  boxShadow: '0 2px 8px rgba(31,43,108,0.07)',
                  padding: '18px',
                  overflowX: 'auto'
                }}>
                  <div className="table-responsive">
                    <table className="appointments-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '15px' }}>
                      <thead style={{ background: '#1F2B6C', color: '#fff' }}>
                        <tr>
                          <th style={{ padding: '10px' }}>ID</th>
                          <th style={{ padding: '10px' }}>Department</th>
                          <th style={{ padding: '10px' }}>Icon</th>
                          <th style={{ padding: '10px' }}>Created At</th>
                          <th style={{ padding: '10px' }}>Updated At</th>
                          <th style={{ padding: '10px' }}>Published At</th>
                          <th style={{ padding: '10px' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {departments.length === 0 ? (
                          <tr>
                            <td colSpan="7" style={{ textAlign: 'center', padding: '18px' }}>No departments found.</td>
                          </tr>
                        ) : (
                          departments.map((dept) => (
                            <tr key={dept.id} style={{ background: '#fff', borderBottom: '1px solid #e5e7eb' }}>
                              <td style={{ padding: '10px', fontWeight: 500 }}>{dept.id}</td>
                              <td style={{ padding: '10px', fontWeight: 500 }}>{dept.DEPARTMENT}</td>
                              <td style={{ padding: '10px' }}>
                                {dept.ICONS ? (
                                  <img src={dept.ICONS} alt="Icon" style={{ width: '40px', height: '40px', borderRadius: '6px', border: '1px solid #e5e7eb', objectFit: 'contain' }} />
                                ) : <span style={{ color: '#888' }}>No Icon</span>}
                              </td>
                              <td style={{ padding: '10px' }}>{dept.createdAt ? new Date(dept.createdAt).toLocaleString() : ''}</td>
                              <td style={{ padding: '10px' }}>{dept.updatedAt ? new Date(dept.updatedAt).toLocaleString() : ''}</td>
                              <td style={{ padding: '10px' }}>{dept.publishedAt ? new Date(dept.publishedAt).toLocaleString() : ''}</td>
                              <td style={{ padding: '10px', display: 'flex', gap: '8px' }}>
                                <button
                                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                                  title="Edit"
                                  onClick={() => handleEditDepartment(dept)}
                                >
                                  <svg width="22" height="22" fill="#4caf50" viewBox="0 0 24 24">
                                    <path d="M3 17.25V21h3.75l11.06-11.06-3.75-3.75L3 17.25zm14.71-10.04a1.003 1.003 0 0 0 0-1.42l-2.5-2.5a1.003 1.003 0 0 0-1.42 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                                  </svg>
                                </button>
                                <button
                                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                                  title="Delete"
                                  onClick={() => handleDeleteDepartment(dept.id)}
                                >
                                  <svg width="22" height="22" fill="#e53e3e" viewBox="0 0 24 24">
                                    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                                  </svg>
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          ) : activePanel === 'specialization' ? (
            <div>
              <h2>Specialization</h2>
              <p>Specialization panel content goes here.</p>
            </div>
          ) : activePanel === 'contact' ? (
            <div>
              <h2>Contact</h2>
              <p>Contact panel content goes here.</p>
            </div>
          ) : activePanel === 'footer' ? (
            <div>
              <h2>Footer</h2>
              <p>Footer panel content goes here.</p>
            </div>
          ) : activePanel === 'department' ? (
            <div>
              <h2>Department</h2>
              <p>Department panel content goes here.</p>
            </div>
          ) : activePanel === 'news' ? (
            <div>
              <h2>News</h2>
              <p>News panel content goes here.</p>
            </div>
          ) : (
            <>
              <h2>Welcome to the Hospital Dashboard</h2>
              <p>This is a protected area for hospital staff.</p>
              {/* Add dashboard widgets or content here */}
            </>
          )}
        </main>
      </div>

      {/* Doctor Details Modal */}
      {selectedDoctor && (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div className="modal-content" style={{ background: '#fff', padding: '20px', borderRadius: '8px', width: '400px', position: 'relative' }}>
            <button className="close-button" onClick={closeDoctorDetails} style={{ position: 'absolute', top: '10px', right: '10px', background: 'transparent', border: 'none', fontSize: '20px', cursor: 'pointer' }}>
              &times;
            </button>
            <h2>Doctor Details</h2>
            {selectedDoctor.doctorImage && (
              <img
                src={selectedDoctor.doctorImage}
                alt={selectedDoctor.name}
                style={{ width: '100px', height: '100px', borderRadius: '50%', marginBottom: '16px' }}
              />
            )}
            <p><strong>Name:</strong> {selectedDoctor.name}</p>
            <p><strong>Department:</strong> {selectedDoctor.dept}</p>
            <p><strong>Specialization:</strong> {selectedDoctor.specialization}</p>
            <p><strong>Profile Data:</strong> {selectedDoctor.addProfileData}</p>
            <p><strong>View Profile:</strong> {selectedDoctor.viewProfile || 'N/A'}</p>
          </div>
        </div>
      )}

      {/* Add/Edit Doctor Form */}
      {editingDoctorId && (
        <div className="modal-overlay" style={{
          position: 'fixed',
          top: 60,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div
            className="modal-content"
            style={{
              background: 'linear-gradient(180deg,#f8fafc 0%,#fff 100%)',
              padding: '30px',
              borderRadius: '8px',
              width: '95%',
              maxWidth: '500px',
              maxHeight: '95vh', // <-- updated from 90vh to 95vh
              overflowY: 'auto',
              position: 'relative',
              boxShadow: '0 4px 16px rgba(31,43,108,0.13)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              margin: 'auto'
            }}
          >
            <button className="close-button" onClick={() => setEditingDoctorId(null)} style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              background: 'transparent',
              border: 'none',
              fontSize: '20px',
              cursor: 'pointer',
              color: '#333'
            }}>
              &times;
            </button>
            <h2 style={{ textAlign: 'center', marginBottom: '15px', color: '#2563eb' }}>Edit Doctor</h2>
            {/* Doctor image preview if available */}
            {(uploadedFile || doctorForm.doctorImage) && (
              <div style={{ textAlign: 'center', marginBottom: '15px', position: 'relative' }}>
                <img
                  src={uploadedFile ? URL.createObjectURL(uploadedFile) : doctorForm.doctorImage}
                  alt={doctorForm.name}
                  style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', boxShadow: '0 2px 8px #e5e7eb' }}
                />
                {uploadedFile && (
                  <button
                    type="button"
                    onClick={() => setUploadedFile(null)}
                    style={{
                      position: 'absolute',
                      top: '0px',
                      right: 'calc(50% - 50px)',
                      background: '#e53e3e',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '50%',
                      width: '24px',
                      height: '24px',
                      cursor: 'pointer',
                      fontWeight: 'bold'
                    }}
                    title="Remove image"
                  >×</button>
                )}
              </div>
            )}
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setLoading(true);
                setError('');
                // Simple validation
                if (!doctorForm.name || !doctorForm.specialization || !doctorForm.dept) {
                  setError('Please fill all required fields.');
                  setLoading(false);
                  return;
                }
                try {
                  let imageId = null;
                  if (uploadedFile) {
                    const formData = new FormData();
                    formData.append('files', uploadedFile);
                    const uploadResponse = await fetch('https://cms-dev.seidrtech.ai/api/upload', {
                      method: 'POST',
                      headers: { Authorization: `Bearer ${token}` },
                      body: formData,
                    });
                    if (!uploadResponse.ok) throw new Error('Failed to upload image');
                    const uploadData = await uploadResponse.json();
                    imageId = uploadData[0].id;
                  }
                  const doctorData = {
                    data: {
                      name: doctorForm.name,
                      dept: doctorForm.dept,
                      specialization: doctorForm.specialization,
                      addprofiledata: doctorForm.addProfileData,
                      viewprofile: doctorForm.viewProfile,
                      ...(imageId && { doctorimage: imageId })
                    }
                  };
                  const response = await fetch(`${doctorApiEndpoint}/${editingDoctorId}`, {
                    method: 'PUT',
                    headers: {
                      'Content-Type': 'application/json',
                      Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(doctorData),
                  });
                  if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error?.message || 'Failed to update doctor');
                  }
                  await handleShowDoctors();
                  setEditingDoctorId(null);
                  setUploadedFile(null);
                  setDoctorForm({
                    name: '',
                    specialization: '',
                    dept: '',
                    addProfileData: '',
                    viewProfile: ''
                  });
                } catch (err) {
                  setError(err.message || 'Failed to update doctor');
                } finally {
                  setLoading(false);
                }
              }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '18px',
                background: '#f3f6fa',
                borderRadius: '8px',
                padding: '10px',
                marginBottom: '10px',
                width: '100%',
                justifyContent: 'center'
              }}
            >
              <label style={{ display: 'flex', flexDirection: 'column', fontWeight: 'bold', color: '#333', position: 'relative', marginBottom: '0px' }}>
                Name
                <input
                  type="text"
                  value={doctorForm.name}
                  onChange={(e) => setDoctorForm({ ...doctorForm, name: e.target.value })}
                  required
                  style={{
                    padding: '8px',
                    borderRadius: '6px',
                    border: doctorForm.name ? '1px solid #ccc' : '1px solid #e53e3e',
                    marginTop: '5px'
                  }}
                  title="Doctor's full name"
                />
                {!doctorForm.name && <span style={{ color: '#e53e3e', fontSize: '12px', position: 'absolute', bottom: '-18px' }}>Required</span>}
              </label>
              <label style={{ display: 'flex', flexDirection: 'column', fontWeight: 'bold', color: '#333', position: 'relative', marginBottom: '0px' }}>
                Specialization
                <input
                  type="text"
                  value={doctorForm.specialization}
                  onChange={(e) => setDoctorForm({ ...doctorForm, specialization: e.target.value })}
                  required
                  style={{
                    padding: '8px',
                    borderRadius: '6px',
                    border: doctorForm.specialization ? '1px solid #ccc' : '1px solid #e53e3e',
                    marginTop: '5px'
                  }}
                  title="Doctor's specialization"
                />
                {!doctorForm.specialization && <span style={{ color: '#e53e3e', fontSize: '12px', position: 'absolute', bottom: '-18px' }}>Required</span>}
              </label>
              <label style={{ display: 'flex', flexDirection: 'column', fontWeight: 'bold', color: '#333', position: 'relative', marginBottom: '0px' }}>
                Department
                <input
                  type="text"
                  value={doctorForm.dept}
                  onChange={(e) => setDoctorForm({ ...doctorForm, dept: e.target.value })}
                  required
                  style={{
                    padding: '8px',
                    borderRadius: '6px',
                    border: doctorForm.dept ? '1px solid #ccc' : '1px solid #e53e3e',
                    marginTop: '5px'
                  }}
                  title="Doctor's department"
                />
                {!doctorForm.dept && <span style={{ color: '#e53e3e', fontSize: '12px', position: 'absolute', bottom: '-18px' }}>Required</span>}
              </label>
              <label style={{ display: 'flex', flexDirection: 'column', fontWeight: 'bold', color: '#333', marginBottom: '0px' }}>
                Profile Data
                <textarea
                  value={doctorForm.addProfileData}
                  onChange={(e) => setDoctorForm({ ...doctorForm, addProfileData: e.target.value })}
                  style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ccc', marginTop: '5px', resize: 'none', height: '60px' }}
                  title="Short profile or bio"
                />
              </label>
              <label style={{ display: 'flex', flexDirection: 'column', fontWeight: 'bold', color: '#333', marginBottom: '0px' }}>
                View Profile
                <textarea
                  value={doctorForm.viewProfile}
                  onChange={(e) => setDoctorForm({ ...doctorForm, viewProfile: e.target.value })}
                  style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ccc', marginTop: '5px', resize: 'none', height: '60px' }}
                  title="Additional profile details"
                />
              </label>
              <label style={{ fontWeight: 'bold', color: '#333', marginBottom: '0px' }}>
                Doctor Image
                <div
                  onDrop={handleDrop}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  style={{
                    border: `2px dashed ${isDragging ? '#1F2B6C' : '#ccc'}`,
                    borderRadius: '8px',
                    padding: '20px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    backgroundColor: isDragging ? '#f0f4ff' : '#f9f9f9',
                    marginBottom: '10px'
                  }}
                  title="Drag & drop or click to upload doctor image"
                >
                  {uploadedFile ? (
                    <div>
                      <img
                        src={URL.createObjectURL(uploadedFile)}
                        alt="Preview"
                        style={{
                          maxWidth: '100%',
                          maxHeight: '200px',
                          borderRadius: '4px'
                        }}
                      />
                      <p>{uploadedFile.name}</p>
                    </div>
                  ) : doctorForm.doctorImage ? (
                    <div>
                      <img
                        src={doctorForm.doctorImage}
                        alt="Current"
                        style={{
                          maxWidth: '100%',
                          maxHeight: '200px',
                          borderRadius: '4px'
                        }}
                      />
                      <p>Current Image</p>
                    </div>
                  ) : (
                    <div>
                      <p>Drag & drop an image here, or click to select</p>
                      <p style={{ fontSize: '12px', color: '#666' }}>Recommended size: 400x400px</p>
                    </div>
                  )}
                  <label
                    htmlFor="edit-file-upload"
                    style={{
                      display: 'inline-block',
                      marginTop: '8px',
                      padding: '6px 14px',
                      background: '#2563eb',
                      color: '#fff',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontWeight: 600
                    }}
                  >
                    Click to select image
                  </label>
                  <input
                    id="edit-file-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    style={{ display: 'none' }}
                  />
                </div>
              </label>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setEditingDoctorId(null)}
                  style={{
                    padding: '8px 16px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    background: 'white',
                    cursor: 'pointer',
                    fontWeight: 500
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '10px',
                    background: '#2563eb',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '6px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    transition: 'background 0.3s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  onMouseOver={(e) => (e.target.style.background = '#1e4db7')}
                  onMouseOut={(e) => (e.target.style.background = '#2563eb')}
                  disabled={loading}
                >
                  {loading && (
                    <span className="spinner" style={{
                      width: '18px',
                      height: '18px',
                      border: '2px solid #fff',
                      borderTop: '2px solid #2563eb',
                      borderRadius: '50%',
                      marginRight: '8px',
                      animation: 'spin 1s linear infinite'
                    }} />
                  )}
                  Save Changes
                </button>
              </div>
              <style>
                {`
                  @keyframes spin {
                    0% { transform: rotate(0deg);}
                    100% { transform: rotate(360deg);}
                  }
                `}
              </style>
            </form>
          </div>
        </div>
      )}

      {/* Doctor Form Modal */}
      {showDoctorModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            width: '90%',
            maxWidth: '600px',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '20px',
            position: 'relative'
          }}>
            <button
              onClick={() => setShowDoctorModal(false)}
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                background: 'none',
                border: 'none',
                fontSize: '20px',
                cursor: 'pointer',
                color: '#666'
              }}
              title="Close"
            >
              ×
            </button>

            <h2>{editingDoctorId ? 'Edit Doctor' : 'Add New Doctor'}</h2>

            <form onSubmit={handleSubmitDoctor}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '5px',
                  fontWeight: '500'
                }}>
                  Name
                </label>
                <input
                  type="text"
                  value={doctorForm.name}
                  onChange={(e) => setDoctorForm({ ...doctorForm, name: e.target.value })}
                  required
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '4px',
                    border: '1px solid #ddd',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '5px',
                  fontWeight: '500'
                }}>
                  Department
                </label>
                <input
                  type="text"
                  value={doctorForm.dept}
                  onChange={(e) => setDoctorForm({ ...doctorForm, dept: e.target.value })}
                  required
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '4px',
                    border: '1px solid #ddd',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '5px',
                  fontWeight: '500'
                }}>
                  Specialization
                </label>
                <input
                  type="text"
                  value={doctorForm.specialization}
                  onChange={(e) => setDoctorForm({ ...doctorForm, specialization: e.target.value })}
                  required
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '4px',
                    border: '1px solid #ddd',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '5px',
                  fontWeight: '500'
                }}>
                  Profile Data
                </label>
                <textarea
                  value={doctorForm.addProfileData}
                  onChange={(e) => setDoctorForm({ ...doctorForm, addProfileData: e.target.value })}
                  rows="3"
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '4px',
                    border: '1px solid #ddd',
                    fontSize: '14px',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '5px',
                  fontWeight: '500'
                }}>
                  View Profile (comma separated)
                </label>
                <textarea
                  value={doctorForm.viewProfile}
                  onChange={(e) => setDoctorForm({ ...doctorForm, viewProfile: e.target.value })}
                  rows="3"
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '4px',
                    border: '1px solid #ddd',
                    fontSize: '14px',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '5px',
                  fontWeight: '500'
                }}>
                  Doctor Image
                </label>
                <div
                  onDrop={handleDrop}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  style={{
                    border: `2px dashed ${isDragging ? '#1F2B6C' : '#ddd'}`,
                    borderRadius: '8px',
                    padding: '20px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    backgroundColor: isDragging ? '#f0f4ff' : '#f9f9f9',
                    marginBottom: '10px'
                  }}
                >
                  {uploadedFile ? (
                    <div>
                      <img
                        src={URL.createObjectURL(uploadedFile)}
                        alt="Preview"
                        style={{
                          maxWidth: '100%',
                          maxHeight: '200px',
                          borderRadius: '4px'
                        }}
                      />
                      <p>{uploadedFile.name}</p>
                    </div>
                  ) : doctorForm.doctorImage ? (
                    <div>
                      <img
                        src={doctorForm.doctorImage}
                        alt="Current"
                        style={{
                          maxWidth: '100%',
                          maxHeight: '200px',
                          borderRadius: '4px'
                        }}
                      />
                      <p>Current Image</p>
                    </div>
                  ) : (
                    <div>
                      <p>Drag & drop an image here, or click to select</p>
                      <p style={{ fontSize: '12px', color: '#666' }}>Recommended size: 400x400px</p>
                    </div>
                  )}
                  <label
                    htmlFor="file-upload"
                    style={{
                      display: 'inline-block',
                      marginTop: '8px',
                      padding: '6px 14px',
                      background: '#2563eb',
                      color: '#fff',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontWeight: 600
                    }}
                  >
                    Click to select image
                  </label>
                  <input
                    id="file-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    style={{ display: 'none' }}
                  />
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setEditingDoctorId(null)}
                  style={{
                    padding: '8px 16px',
                    border: '1px solid #cbd5e1',
                    borderRadius: '4px',
                    background: 'white',
                    cursor: 'pointer',
                    fontWeight: 500
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '10px',
                    background: '#2563eb',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '6px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    transition: 'background 0.3s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  onMouseOver={(e) => (e.target.style.background = '#1e4db7')}
                  onMouseOut={(e) => (e.target.style.background = '#2563eb')}
                  disabled={loading}
                >
                  {loading && (
                    <span className="spinner" style={{
                      width: '18px',
                      height: '18px',
                      border: '2px solid #fff',
                      borderTop: '2px solid #2563eb',
                      borderRadius: '50%',
                      marginRight: '8px',
                      animation: 'spin 1s linear infinite'
                    }} />
                  )}
                  Save Changes
                </button>
              </div>
              <style>
                {`
                  @keyframes spin {
                    0% { transform: rotate(0deg);}
                    100% { transform: rotate(360deg);}
                  }
                `}
              </style>
            </form>
          </div>
        </div>
      )}

      {/* Service View Modal */}
      {selectedService && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            width: '95%',
            maxWidth: '420px',
            padding: '28px 24px',
            position: 'relative',
            boxShadow: '0 4px 16px rgba(31,43,108,0.13)'
          }}>
            <button
              onClick={closeServiceDetails}
              style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                background: 'none',
                border: 'none',
                fontSize: '22px',
                cursor: 'pointer',
                color: '#666'
              }}
              title="Close"
            >
              ×
            </button>
            <h2 style={{ color: '#1F2B6C', marginBottom: '18px', fontWeight: 700 }}>Service Details</h2>
            {/* Fix image URL to be absolute */}
            {selectedService.image && (
              <img
                src={
                  selectedService.image.startsWith('http')
                    ? selectedService.image
                    : `https://j8potcdn-dev.seidrtech.ai${selectedService.image}`
                }
                alt="Service"
                style={{
                  width: '100%',
                  maxHeight: '160px',
                  objectFit: 'cover',
                  borderRadius: '8px',
                  marginBottom: '14px',
                  border: '1px solid #e5e7eb'
                }}
              />
            )}
            {selectedService.logo && (
              <img
                src={
                  selectedService.logo.startsWith('http')
                    ? selectedService.logo
                    : `https://j8potcdn-dev.seidrtech.ai${selectedService.logo}`
                }
                alt="Logo"
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '8px',
                  marginBottom: '14px',
                  border: '1px solid #e5e7eb'
                }}
              />
            )}
            <div style={{ marginBottom: '10px' }}>
              <strong style={{ color: '#2563eb' }}>Service Name:</strong> {selectedService.service_name}
            </div>
            <div style={{ marginBottom: '10px' }}>
              <strong style={{ color: '#2563eb' }}>Description:</strong>
              {selectedService.Text && selectedService.Text.includes('\n') ? (
                <ul style={{ color: '#444', marginTop: '4px', paddingLeft: '18px' }}>
                  {selectedService.Text.split('\n').map((pt, idx) => (
                    <li key={idx}>{pt.trim()}</li>
                  ))}
                </ul>
              ) : (
                <div style={{ color: '#444', marginTop: '4px', whiteSpace: 'pre-line' }}>{selectedService.Text}</div>
              )}
            </div>
            <div style={{ marginBottom: '10px' }}>
              <strong style={{ color: '#2563eb' }}>Created At:</strong> {selectedService.createdAt ? new Date(selectedService.createdAt).toLocaleString() : ''}
            </div>
            <div style={{ marginBottom: '10px' }}>
              <strong style={{ color: '#2563eb' }}>Updated At:</strong> {selectedService.updatedAt ? new Date(selectedService.updatedAt).toLocaleString() : ''}
            </div>
            <div>
              <strong style={{ color: '#2563eb' }}>Published At:</strong> {selectedService.publishedAt ? new Date(selectedService.publishedAt).toLocaleString() : ''}
            </div>
          </div>
        </div>
      )}

      {/* Service Modal */}
      {showServiceModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            width: '95%',
            maxWidth: '600px',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '28px 24px',
            position: 'relative',
            boxShadow: '0 4px 16px rgba(31,43,108,0.13)'
          }}>
            <button
              onClick={() => setShowServiceModal(false)}
              style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                background: 'none',
                border: 'none',
                fontSize: '22px',
                cursor: 'pointer',
                color: '#666'
              }}
              title="Close"
            >
              ×
            </button>
            <h2 style={{ color: '#1F2B6C', marginBottom: '18px', fontWeight: 700 }}>
              {editingServiceId ? 'Edit Service' : 'Add New Service'}
            </h2>
            <form onSubmit={handleSubmitService}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#2563eb' }}>
                  Service Name*
                </label>
                <input
                  type="text"
                  value={serviceForm.service_name}
                  onChange={(e) => setServiceForm({ ...serviceForm, service_name: e.target.value })}
                  required
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    fontSize: '15px'
                  }}
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#2563eb' }}>
                  Description*
                </label>
                <textarea
                  value={serviceForm.Text}
                  onChange={(e) => setServiceForm({ ...serviceForm, Text: e.target.value })}
                  required
                  rows="3"
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    fontSize: '15px',
                    resize: 'vertical'
                  }}
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#2563eb' }}>
                  Service Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleServiceImageSelect}
                  style={{ marginBottom: '10px' }}
                />
                {serviceImageFile && (
                  <img src={URL.createObjectURL(serviceImageFile)} alt="Preview" style={{ width: '80px', height: '60px', borderRadius: '6px', marginBottom: '10px', border: '1px solid #e5e7eb' }} />
                )}
                {!serviceImageFile && serviceForm.image && (
                  <img src={serviceForm.image} alt="Preview" style={{ width: '80px', height: '60px', borderRadius: '6px', marginBottom: '10px', border: '1px solid #e5e7eb' }} />
                )}
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#2563eb' }}>
                  Service Logo
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleServiceLogoSelect}
                  style={{ marginBottom: '10px' }}
                />
                {serviceLogoFile && (
                  <img src={URL.createObjectURL(serviceLogoFile)} alt="Preview" style={{ width: '60px', height: '60px', borderRadius: '6px', marginBottom: '10px', border: '1px solid #e5e7eb' }} />
                )}
                {!serviceLogoFile && serviceForm.logo && (
                  <img src={serviceForm.logo} alt="Preview" style={{ width: '60px', height: '60px', borderRadius: '6px', marginBottom: '10px', border: '1px solid #e5e7eb' }} />
                )}
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#2563eb' }}>
                  Description Points*
                </label>
                {servicePoints.map((pt, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', marginBottom: '6px' }}>
                    <input
                      type="text"
                      value={pt}
                      onChange={(e) => handleEditPoint(idx, e.target.value)}
                      required
                      style={{
                        flex: 1,
                        padding: '8px',
                        borderRadius: '6px',
                        border: '1px solid #cbd5e1',
                        fontSize: '15px'
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => handleDeletePoint(idx)}
                      style={{
                        marginLeft: '8px',
                        background: '#e53e3e',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontWeight: '600',
                        padding: '4px 10px'
                      }}
                      title="Delete point"
                    >
                      ×
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleAddPoint}
                  style={{
                    marginTop: '8px',
                    background: '#2563eb',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    padding: '6px 14px'
                  }}
                >
                  + Add Point
                </button>
              </div>
              {error && (
                <div style={{
                  color: '#dc3545',
                  marginBottom: '15px',
                  padding: '10px',
                  backgroundColor: '#f8d7da',
                  borderRadius: '6px',
                  border: '1px solid #f5c6cb'
                }}>
                  {error}
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowServiceModal(false)}
                  style={{
                    padding: '8px 16px',
                    border: '1px solid #cbd5e1',
                    borderRadius: '6px',
                    background: 'white',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#1F2B6C',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    opacity: loading ? 0.7 : 1,
                    fontWeight: 600
                  }}
                >
                  {loading ? 'Saving...' : 'Save Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Department Modal */}
      {showDepartmentModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            width: '95%',
            maxWidth: '420px',
            padding: '28px 24px',
            position: 'relative',
            boxShadow: '0 4px 16px rgba(31,43,108,0.13)'
          }}>
            <button
              onClick={() => setShowDepartmentModal(false)}
              style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                background: 'none',
                border: 'none',
                fontSize: '22px',
                cursor: 'pointer',
                color: '#666'
              }}
              title="Close"
            >
              ×
            </button>
            <h2 style={{ color: '#1F2B6C', marginBottom: '18px', fontWeight: 700 }}>
              {editingDepartmentId ? 'Edit Department' : 'Add New Department'}
            </h2>
            <form onSubmit={handleSubmitDepartment}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#2563eb' }}>
                  Department Name*
                </label>
                <input
                  type="text"
                  value={departmentForm.DEPARTMENT}
                  onChange={(e) => setDepartmentForm({ ...departmentForm, DEPARTMENT: e.target.value })}
                  required
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    fontSize: '15px'
                  }}
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#2563eb' }}>
                  Department Icon
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleDepartmentIconSelect}
                  style={{ marginBottom: '10px' }}
                />
                {departmentForm.ICONS && (
                  <img src={URL.createObjectURL(departmentForm.ICONS)} alt="Preview" style={{ width: '48px', height: '48px', borderRadius: '8px', marginBottom: '10px', border: '1px solid #e5e7eb' }} />
                )}
              </div>
              {error && (
                <div style={{
                  color: '#dc3545',
                  marginBottom: '15px',
                  padding: '10px',
                  backgroundColor: '#f8d7da',
                  borderRadius: '6px',
                  border: '1px solid #f5c6cb'
                }}>
                  {error}
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowDepartmentModal(false)}
                  style={{
                    padding: '8px 16px',
                    border: '1px solid #cbd5e1',
                    borderRadius: '6px',
                    background: 'white',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loadingDepartments}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#1F2B6C',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    opacity: loadingDepartments ? 0.7 : 1,
                    fontWeight: 600
                  }}
                >
                  {loadingDepartments ? 'Saving...' : 'Save Department'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Service Home Modal */}
      {showServiceHomeModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            width: '95%',
            maxWidth: '600px',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '28px 24px',
            position: 'relative',
            boxShadow: '0 4px 16px rgba(31,43,108,0.13)'
          }}>
            <button
              onClick={() => setShowServiceHomeModal(false)}
              style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                background: 'none',
                border: 'none',
                fontSize: '22px',
                cursor: 'pointer',
                color: '#666'
              }}
              title="Close"
            >
              ×
            </button>
            <h2 style={{ color: '#1F2B6C', marginBottom: '18px', fontWeight: 700 }}>
              {editingServiceHomeId ? 'Edit Service Home' : 'Add New Service Home'}
            </h2>
            <form onSubmit={handleSubmitServiceHome}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#2563eb' }}>
                  Heading*
                </label>
                <input
                  type="text"
                  value={serviceHomeForm.heading}
                  onChange={(e) => setServiceHomeForm({ ...serviceHomeForm, heading: e.target.value })}
                  required
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    fontSize: '15px'
                  }}
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#2563eb' }}>
                  Points* (newline separated)
                </label>
                <textarea
                  value={serviceHomeForm.points}
                  onChange={(e) => setServiceHomeForm({ ...serviceHomeForm, points: e.target.value })}
                  required
                  rows="2"
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    fontSize: '15px',
                    resize: 'vertical'
                  }}
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#2563eb' }}>
                  Service Para*
                </label>
                <textarea
                  value={serviceHomeForm.servicepara}
                  onChange={(e) => setServiceHomeForm({ ...serviceHomeForm, servicepara: e.target.value })}
                  required
                  rows="3"
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    fontSize: '15px',
                    resize: 'vertical'
                  }}
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#2563eb' }}>
                  Side Points* (newline separated)
                </label>
                <textarea
                  value={serviceHomeForm.sidepoints}
                  onChange={(e) => setServiceHomeForm({ ...serviceHomeForm, sidepoints: e.target.value })}
                  required
                  rows="2"
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    fontSize: '15px',
                    resize: 'vertical'
                  }}
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#2563eb' }}>
                  Service Images (multiple)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleServiceHomeImageSelect}
                  style={{ marginBottom: '10px' }}
                />
                {serviceHomeImageFiles.length > 0 && (
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {serviceHomeImageFiles.map((file, idx) => (
                      <img key={idx} src={URL.createObjectURL(file)} alt="Preview" style={{ width: '60px', height: '40px', borderRadius: '6px', marginBottom: '10px', border: '1px solid #e5e7eb' }} />
                    ))}
                  </div>
                )}
                {!serviceHomeImageFiles.length && serviceHomeForm.service_image && (
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {serviceHomeForm.service_image.map((img, idx) => (
                      <img key={idx} src={img.startsWith('http') ? img : `https://j8potcdn-dev.seidrtech.ai${img}`} alt="Preview" style={{ width: '60px', height: '40px', borderRadius: '6px', marginBottom: '10px', border: '1px solid #e5e7eb' }} />
                    ))}
                  </div>
                )}
              </div>
              {serviceHomeError && (
                <div style={{
                  color: '#dc3545',
                  marginBottom: '15px',
                  padding: '10px',
                  backgroundColor: '#f8d7da',
                  borderRadius: '6px',
                  border: '1px solid #f5c6cb'
                }}>
                  {serviceHomeError}
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowServiceHomeModal(false)}
                  style={{
                    padding: '8px 16px',
                    border: '1px solid #cbd5e1',
                    borderRadius: '6px',
                    background: 'white',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loadingServiceHome}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#1F2B6C',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    opacity: loadingServiceHome ? 0.7 : 1,
                    fontWeight: 600
                  }}
                >
                  {loadingServiceHome ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Responsive styles for Edit Doctor form modal only */}
      <style>
        {`
          .modal-content form {
            display: flex !important;
            flex-direction: column !important;
            gap: 18px !important;
            width: 100% !important;
          }
          @media (max-width: 600px) {
            .modal-content {
              width: 98vw !important;
              max-width: 98vw !important;
              padding: 10px !important;
            }
            .modal-content form {
              gap: 12px !important;
            }
            .modal-content input,
            .modal-content textarea,
            .modal-content button {
              width: 100% !important;
              min-width: 0 !important;
              box-sizing: border-box;
            }
          }
          @media (max-width: 400px) {
            .modal-content {
              padding: 4px !important;
            }
          }
        `}
      </style>
    </div>
  );
};

export default Dashboard;