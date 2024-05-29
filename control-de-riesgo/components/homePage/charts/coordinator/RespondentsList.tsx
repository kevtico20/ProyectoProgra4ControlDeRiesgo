import React, { useEffect, useState } from 'react';
import Pagination from '../../../form/pagination';
import { useUser } from '../../../../lib/userContext';
import { DepartmentType } from "../../../index";

interface User {
  usu_id: number;
  usu_name: string;
  usu_email: string;
  usu_idnumber: string;
  usertype: {
    usut_role: string;
  };
  department: {
    dep_name: string;
  };
}

const RespondentsList: React.FC = () => {
  const { user } = useUser();
  const [users, setUsers] = useState<User[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedDepartment, setSelectedDepartment] = useState<string>("1");
  const [departmentTypes, setDepartmentTypes] = useState<DepartmentType[]>([]);

  useEffect(() => {
    const fetchDepartmentTypes = async () => {
      try {
        const response = await fetch('/api/dashboard/coordinator/getDepartments');
        if (!response.ok) throw new Error('Failed to fetch department types');
        const data: DepartmentType[] = await response.json();
        setDepartmentTypes(data);
        setSelectedDepartment(data[0].dep_id.toString()); // Set default department to the first one
      } catch (error) {
        console.error('Error fetching department types:', error);
      }
    };
    fetchDepartmentTypes();
  }, []);

  useEffect(() => {
    if (user && selectedDepartment) {
      const fetchUsers = async () => {
        try {
          const response = await fetch(`/api/dashboard/coordinator/getRespondents?department=${selectedDepartment}&page=${currentPage}`);
          if (!response.ok) throw new Error('Failed to fetch users');
          const data = await response.json();
          setUsers(data.users);
          setTotalPages(Math.ceil(data.totalCount / 5));
        } catch (error) {
          console.error('Error fetching users:', error);
        }
      };
      fetchUsers();
    }
  }, [user, selectedDepartment, currentPage]);

  const handleDepartmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDepartment(e.target.value);
    setCurrentPage(0);
  };

  return (
    <div className="my-4 w-full bg-background-3 shadow-lg rounded-lg p-5 text-white">
      <h3 className="text-lg font-semibold mb-3">Respondents</h3>
      <div className="mb-4">
        <label htmlFor="department" className="block text-white mb-2">Select Department:</label>
        <select
          id="department"
          value={selectedDepartment}
          onChange={handleDepartmentChange}
          className="bg-gray-700 text-white rounded-lg px-4 py-2"
        >
          {departmentTypes.map((department) => (
            <option key={department.dep_id} value={department.dep_id.toString()}>
              {department.dep_name}
            </option>
          ))}
        </select>
      </div>
      {users.length > 0 ? (
        <ul>
          {users.map((user) => (
            <li key={user.usu_id} className="mb-2">
              <strong>Name:</strong> {user.usu_name} <br />
              <strong>Email:</strong> {user.usu_email} <br />
              <strong>ID Number:</strong> {user.usu_idnumber} <br />
              <strong>Role:</strong> {user.usertype.usut_role} <br />
              <strong>Department:</strong> {user.department.dep_name}
            </li>
          ))}
        </ul>
      ) : (
        <p>No respondents found.</p>
      )}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default RespondentsList;