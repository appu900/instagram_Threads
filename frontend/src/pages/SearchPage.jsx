import React, { useEffect, useState } from "react";
import ProfileCards from "../components/ProfileCards";


const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState([]);

  // #1 function to fetch all users
  const fetchAllUsers = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/users/allusers");
      const data = await response.json();
      console.log(data);
      setUsers(data);
    } catch (error) {
      console.log(error);
    }
  };

  // #2 function to search users
  const searchUsers = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/users/allusers?search=${searchQuery}`
      );
      const data = await response.json();
      console.log(data);
      setUsers(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setUsers([]);
    if (searchQuery === "") {
      fetchAllUsers();
    } else {
      searchUsers();
    }
  }, [searchQuery]);

  return (
    <div>
      <div className="w-full  border rounded border-slate-500">
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          type="text"
          placeholder="Search"
          className="w-full p-2 border rounded bg-transparent "
        />
      </div>
      {/* show profile cards based on search and by default show all data coming from the backend */}
      {
        users.length === 0 && <h1 className="text-center mt-24">no user not found</h1>
      }

      {
        users.map((user) => {
          return <ProfileCards user={user} />;
        })
      }

    </div>
  );
};

export default SearchPage;
