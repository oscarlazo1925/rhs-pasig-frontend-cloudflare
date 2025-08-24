import { useEffect, useState } from "react";
import axiosInstance from "../axiosInstance";
import Loader from "../components/LoaderDots";
import { Form, Button, Card } from "react-bootstrap";
import toast from 'react-hot-toast';


function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    photo: "",
  });

  // Fetch Profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axiosInstance.get("/users/profile");
        console.log(res.data)
        setProfile(res.data.user);
        setFormData({
          firstname: res.data.user.firstname || "",
          middlename: res.data.user.middlename || "",
          lastname: res.data.user.lastname || "",
          photo: res.data.user.photo || "",
          qrCode: res.data.user.qrCode || "",
        });
      } catch (err) {
        console.error("Profile fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Handle form change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Save updated profile
  const handleSave = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const res = await axiosInstance.put("/users/profile", formData);
      setProfile(res.data); // update UI
      toast.success('Profile updated successfully!');
      // alert("Profile updated successfully!");
    } catch (err) {
      console.error("Update error:", err);
      toast.error('Failed to update profile.');
      // alert("Failed to update profile.");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="container mt-4 col-md-6">
      <Card className="p-4 shadow">
        <h2 className="mb-4">Edit Profile</h2>

        <Form onSubmit={handleSave}>
          <Form.Group className="mb-3">
            <Form.Label>Email (read-only)</Form.Label>
            <Form.Control type="email" value={profile.email} disabled />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Firstname</Form.Label>
            <Form.Control
              type="text"
              name="firstname"
              value={formData.firstname}
              onChange={handleChange}
              placeholder="Enter your firstname"
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Middlename</Form.Label>
            <Form.Control
              type="text"
              name="middlename"
              value={formData.middlename}
              onChange={handleChange}
              placeholder="Enter your middlename"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Lastname</Form.Label>
            <Form.Control
              type="text"
              name="lastname"
              value={formData.lastname}
              onChange={handleChange}
              placeholder="Enter your lastname"
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>QR Code</Form.Label>
            <Form.Control
              type="text"
              name="qrCode"
              value={formData.qrCode}
              onChange={handleChange}
              placeholder="Enter your qrCode"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Profile Photo URL</Form.Label>
            <Form.Control
              type="text"
              name="photo"
              value={formData.photo}
              onChange={handleChange}
              placeholder="Paste image URL"
              disabled
            />
          </Form.Group>

          {formData.photo && (
            <div className="text-center mb-3">
              <img
                src={formData.photo}
                alt="Profile Preview"
                className="rounded-circle"
                style={{ width: "100px", height: "100px", objectFit: "cover" }}
              />
            </div>
          )}

          <div className="text-center">
          <Button type="submit" variant="secondary" disabled={updating} className="w-50">
            {updating ? "Saving..." : "Save Changes"}
          </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
}

export default Profile;
