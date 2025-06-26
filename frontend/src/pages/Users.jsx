import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ViewUserModal from "../component/UsersComponent/ViewUserModal";
import EditUserModal from "../component/UsersComponent/EditUserModal";
import AddUserModal from "../component/UsersComponent/AddUserModal";
import UserTable from "../component/UsersComponent/UsersTable";
import apiRequest from "../utils/apiRequest";
import { CLIENTVU_API_END_POINT } from "../constant";
import { Loader } from "../component/Loader"; // Assuming you have a Loader component
import toast from "../utils/toast";
import LoaderModal from "../component/LoadingModal";

const Users = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newClientViewUser, setNewClientViewUser] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Added loading state
  const { accessToken,authUser } = useSelector((state) => state.user);
    const { currentEvent } = useSelector((state) => state.event);
  
  const dispatch = useDispatch();

  const fetchClientViewUsers = async () => {
    try {
      const endpoint = `${CLIENTVU_API_END_POINT}/getAllClientViewUsers/${authUser?._id}`;
      const res = await apiRequest("GET", endpoint, {}, accessToken, dispatch);
      if (res.status === 200) {
        setNewClientViewUser(res.data.data);
        setIsLoading(false); // Stop loading once data is fetched
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false); // Stop loading in case of error
      toast.error("Failed to fetch users.");
    }
  };

  useEffect(() => {
    fetchClientViewUsers();
  }, [accessToken]);

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

      {/* Display Loading Spinner if Data is Fetching */}
      {isLoading ? (
        <div className="flex justify-center items-center py-10">
          <LoaderModal message={"Users Data is Loading..."} isOpen={isLoading}/>
        </div>
      ) : (
        <UserTable
          newClientViewUser={newClientViewUser}
          onView={(user) => {
            setSelectedUser(user);
            setShowViewModal(true);
          }}
          onEdit={(user) => {
            setSelectedUser(user);
            setShowEditModal(true);
          }}
        />
      )}

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
