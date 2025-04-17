import React, { useState } from "react";

import ViewUserModal from "../component/UsersComponent/ViewUserModal";
import EditUserModal from "../component/UsersComponent/EditUserModal";
import AddUserModal from "../component/UsersComponent/AddUserModal";
import UserTable from "../component/UsersComponent/UsersTable";

const Users = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const users = [
    {
      id: 1,
      name: "Dhruv",
      email: "Dhruvvankar63@gmail.com",
      phone: "+91-814412301",
      favorites: 0,
      createdDate: "2025-04-09 13:14:25",
      verifiedEmail: true,
      verifiedMobile: true,
      userType: "Guest User",
      loginType: "Guest Login",
      loginDevice: "Web",
      status: "Active",
    },
    {
      id: 2,
      name: "Amit Patel",
      email: "amitpatel@gmail.com",
      phone: "+91-9876543210",
      favorites: 3,
      createdDate: "2025-04-08 09:10:00",
      verifiedEmail: false,
      verifiedMobile: true,
      userType: "Registered User",
      loginType: "Email Login",
      loginDevice: "Mobile",
      status: "Inactive",
    },
    {
      id: 3,
      name: "Sneha Mehta",
      email: "sneha.mehta@gmail.com",
      phone: "+91-9876123450",
      favorites: 5,
      createdDate: "2025-04-07 15:22:30",
      verifiedEmail: true,
      verifiedMobile: false,
      userType: "Registered User",
      loginType: "Google Login",
      loginDevice: "Web",
      status: "Active",
    },
    {
      id: 4,
      name: "Jay Bhatt",
      email: "jay.bhatt@yahoo.com",
      phone: "+91-9102938475",
      favorites: 2,
      createdDate: "2025-04-06 11:45:12",
      verifiedEmail: true,
      verifiedMobile: true,
      userType: "Guest User",
      loginType: "Guest Login",
      loginDevice: "Tablet",
      status: "Active",
    },
    {
      id: 5,
      name: "Kajal Shah",
      email: "kajal.shah@gmail.com",
      phone: "+91-9988776655",
      favorites: 1,
      createdDate: "2025-04-05 18:30:10",
      verifiedEmail: false,
      verifiedMobile: false,
      userType: "Registered User",
      loginType: "Facebook Login",
      loginDevice: "Mobile",
      status: "Pending",
    },
    {
      id: 6,
      name: "Dhruv Patel",
      email: "dhruvpatel@gmail.com",
      phone: "+91-9123456780",
      favorites: 0,
      createdDate: "2025-04-09 09:05:00",
      verifiedEmail: true,
      verifiedMobile: true,
      userType: "Admin",
      loginType: "Email Login",
      loginDevice: "Web",
      status: "Active",
    },
    {
      id: 7,
      name: "Pooja Rana",
      email: "pooja.rana@hotmail.com",
      phone: "+91-9191919191",
      favorites: 7,
      createdDate: "2025-04-04 12:10:05",
      verifiedEmail: true,
      verifiedMobile: false,
      userType: "Guest User",
      loginType: "Guest Login",
      loginDevice: "Mobile",
      status: "Inactive",
    },
    {
      id: 8,
      name: "Rohit Sharma",
      email: "rohit.sharma@gmail.com",
      phone: "+91-8000000001",
      favorites: 4,
      createdDate: "2025-04-03 17:25:00",
      verifiedEmail: true,
      verifiedMobile: true,
      userType: "Registered User",
      loginType: "Google Login",
      loginDevice: "Web",
      status: "Active",
    },
    {
      id: 9,
      name: "Ankita Joshi",
      email: "ankita.joshi@gmail.com",
      phone: "+91-8123456790",
      favorites: 6,
      createdDate: "2025-04-02 14:45:00",
      verifiedEmail: false,
      verifiedMobile: true,
      userType: "Guest User",
      loginType: "Guest Login",
      loginDevice: "Mobile",
      status: "Blocked",
    },
    {
      id: 10,
      name: "Rakesh Singh",
      email: "rakesh.singh@gmail.com",
      phone: "+91-8777766554",
      favorites: 3,
      createdDate: "2025-04-01 19:30:30",
      verifiedEmail: true,
      verifiedMobile: true,
      userType: "Admin",
      loginType: "Email Login",
      loginDevice: "Web",
      status: "Active",
    },
    {
      id: 11,
      name: "Priya Desai",
      email: "priya.desai@gmail.com",
      phone: "+91-9898989898",
      favorites: 2,
      createdDate: "2025-03-31 10:15:45",
      verifiedEmail: true,
      verifiedMobile: false,
      userType: "Registered User",
      loginType: "Facebook Login",
      loginDevice: "Tablet",
      status: "Pending",
    },
    {
      id: 12,
      name: "Nikhil Jain",
      email: "nikhil.jain@gmail.com",
      phone: "+91-9212345678",
      favorites: 0,
      createdDate: "2025-03-30 09:00:00",
      verifiedEmail: false,
      verifiedMobile: false,
      userType: "Guest User",
      loginType: "Guest Login",
      loginDevice: "Mobile",
      status: "Inactive",
    },
    {
      id: 13,
      name: "Bhavika Shah",
      email: "bhavika.shah@gmail.com",
      phone: "+91-9090909090",
      favorites: 1,
      createdDate: "2025-03-29 11:20:15",
      verifiedEmail: true,
      verifiedMobile: true,
      userType: "Registered User",
      loginType: "Email Login",
      loginDevice: "Web",
      status: "Active",
    },
    {
      id: 14,
      name: "Arjun Yadav",
      email: "arjun.yadav@gmail.com",
      phone: "+91-9345678901",
      favorites: 5,
      createdDate: "2025-03-28 16:45:00",
      verifiedEmail: true,
      verifiedMobile: true,
      userType: "Registered User",
      loginType: "Google Login",
      loginDevice: "Mobile",
      status: "Blocked",
    },
    {
      id: 15,
      name: "Neha Trivedi",
      email: "neha.trivedi@gmail.com",
      phone: "+91-9334567890",
      favorites: 3,
      createdDate: "2025-03-27 08:30:10",
      verifiedEmail: false,
      verifiedMobile: true,
      userType: "Guest User",
      loginType: "Guest Login",
      loginDevice: "Web",
      status: "Inactive",
    },
    {
      id: 16,
      name: "Manish Kumar",
      email: "manish.kumar@gmail.com",
      phone: "+91-8123456789",
      favorites: 4,
      createdDate: "2025-03-26 12:00:00",
      verifiedEmail: true,
      verifiedMobile: true,
      userType: "Registered User",
      loginType: "Facebook Login",
      loginDevice: "Tablet",
      status: "Active",
    },
    {
      id: 17,
      name: "Divya Rathi",
      email: "divya.rathi@gmail.com",
      phone: "+91-8111223344",
      favorites: 2,
      createdDate: "2025-03-25 18:15:25",
      verifiedEmail: true,
      verifiedMobile: false,
      userType: "Admin",
      loginType: "Email Login",
      loginDevice: "Web",
      status: "Active",
    },
    {
      id: 18,
      name: "Sahil Khan",
      email: "sahil.khan@gmail.com",
      phone: "+91-8111998877",
      favorites: 3,
      createdDate: "2025-03-24 09:40:00",
      verifiedEmail: false,
      verifiedMobile: false,
      userType: "Guest User",
      loginType: "Guest Login",
      loginDevice: "Mobile",
      status: "Inactive",
    },
    {
      id: 19,
      name: "Mitali Chauhan",
      email: "mitali.chauhan@gmail.com",
      phone: "+91-8777888899",
      favorites: 1,
      createdDate: "2025-03-23 14:05:00",
      verifiedEmail: true,
      verifiedMobile: true,
      userType: "Registered User",
      loginType: "Google Login",
      loginDevice: "Tablet",
      status: "Active",
    },
    {
      id: 20,
      name: "Suresh Reddy",
      email: "suresh.reddy@gmail.com",
      phone: "+91-8444332211",
      favorites: 6,
      createdDate: "2025-03-22 07:55:00",
      verifiedEmail: false,
      verifiedMobile: true,
      userType: "Registered User",
      loginType: "Facebook Login",
      loginDevice: "Web",
      status: "Pending",
    },
    {
      id: 21,
      name: "Anjali Pandey",
      email: "anjali.pandey@gmail.com",
      phone: "+91-9888877766",
      favorites: 0,
      createdDate: "2025-03-21 19:00:00",
      verifiedEmail: true,
      verifiedMobile: false,
      userType: "Guest User",
      loginType: "Guest Login",
      loginDevice: "Mobile",
      status: "Active",
    },
    {
      id: 22,
      name: "Tarun Verma",
      email: "tarun.verma@gmail.com",
      phone: "+91-9988771122",
      favorites: 5,
      createdDate: "2025-03-20 10:10:10",
      verifiedEmail: true,
      verifiedMobile: true,
      userType: "Admin",
      loginType: "Email Login",
      loginDevice: "Web",
      status: "Active",
    },
    {
      id: 23,
      name: "Reena Kapoor",
      email: "reena.kapoor@gmail.com",
      phone: "+91-8444556677",
      favorites: 2,
      createdDate: "2025-03-19 08:35:00",
      verifiedEmail: false,
      verifiedMobile: true,
      userType: "Guest User",
      loginType: "Guest Login",
      loginDevice: "Tablet",
      status: "Inactive",
    },
    {
      id: 24,
      name: "Harshad Joshi",
      email: "harshad.joshi@gmail.com",
      phone: "+91-8322445566",
      favorites: 3,
      createdDate: "2025-03-18 13:55:30",
      verifiedEmail: true,
      verifiedMobile: false,
      userType: "Registered User",
      loginType: "Google Login",
      loginDevice: "Web",
      status: "Active",
    },
    {
      id: 25,
      name: "Swati Patel",
      email: "swati.patel@gmail.com",
      phone: "+91-8123456781",
      favorites: 4,
      createdDate: "2025-03-17 20:10:15",
      verifiedEmail: true,
      verifiedMobile: true,
      userType: "Registered User",
      loginType: "Email Login",
      loginDevice: "Mobile",
      status: "Blocked",
    },
  ];

  return (
    <div className="p-5 font-sans">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-black text-xl font-semibold">Users List</h2>

        <div className="flex gap-2">
          <button
            className="ml-2 px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded cursor-pointer transition"
            onClick={() => setShowAddModal(true)}
          >
            Add User
          </button>
          <button className="px-4 py-2 border border-slate-dark font-semibold bg-slate hover:bg-slate-dark hover:text-black rounded cursor-pointer transition">
            Export User
          </button>
          <button className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded cursor-pointer transition">
            Delete Bulk Users
          </button>
        </div>
      </div>

      <UserTable
        users={users}
        onView={(user) => {
          setSelectedUser(user);
          setShowViewModal(true);
        }}
        onEdit={(user) => {
          setSelectedUser(user);
          setShowEditModal(true);
        }}
      />

      {showAddModal && <AddUserModal onClose={() => setShowAddModal(false)} />}
      {showViewModal && selectedUser && (
        <ViewUserModal
          user={selectedUser}
          onClose={() => setShowViewModal(false)}
        />
      )}
      {showEditModal && selectedUser && (
        <EditUserModal
          user={selectedUser}
          onClose={() => setShowEditModal(false)}
        />
      )}
    </div>
  );
};

export default Users;
