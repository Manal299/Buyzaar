import { useState } from "react";
import { getAllUsersSSR, updateUserAction } from "@/helpers/api-utils";

export async function getServerSideProps(context) {
  const users = await getAllUsersSSR(context); // Axios-based SSR
  return { props: { users } };
}

export default function AdminUsers({ users }) {
  const [userList, setUserList] = useState(users);

  async function handleAction(id, action) {
    const res = await updateUserAction(id, action); // Axios-based client fetch
    if (res.ok) {
      alert(res.data.message);

      // Update UI without reload
      const updated = userList.map((user) => {
        if (user._id === id) {
          if (action === "ban") user.status = "banned";
          if (action === "unban") user.status = "active";
          if (action === "promote") user.role = "seller";
          if (action === "demote") user.role = "buyer";
        }
        return user;
      });
      setUserList(updated);
    } else {
      alert("Error: " + res.data.message);
    }
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Admin Panel - All Users</h1>
      <table border="1" cellPadding="10" style={{ width: "100%", marginTop: "1rem" }}>
        <thead>
          <tr>
            <th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {userList.map((user) => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>{user.status}</td>
              <td>
                <button onClick={() => handleAction(user._id, user.status === 'active' ? 'ban' : 'unban')}>
                  {user.status === 'active' ? 'Ban' : 'Unban'}
                </button>
                &nbsp;
                <button onClick={() => handleAction(user._id, user.role === 'buyer' ? 'promote' : 'demote')}>
                  {user.role === 'buyer' ? 'Promote to Seller' : 'Demote to Buyer'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
