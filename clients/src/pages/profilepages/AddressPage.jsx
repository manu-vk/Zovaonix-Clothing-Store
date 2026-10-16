
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaBars, FaTimes } from "react-icons/fa";
import ProfileSideBar from '../../components/profileComponents/ProfileSideBar'

const AddressPage = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [addresses, setAddresses] = useState([]);


  const [newAddress, setNewAddress] = useState({
    fullName: "",
    phoneNumber: "",
    streetAddress: "",
    city: "",
    state: "",
    pincode: "",
    isDefault: false,
  });

  const [showForm, setShowForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);

  const fetchAddresses = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "https://zovaonix-backend.onrender.com/api/address",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAddresses(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      if (editingAddressId) {
        await axios.put(
          `https://zovaonix-backend.onrender.com/api/address/${editingAddressId}`,
          newAddress,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        await axios.post(
          "https://zovaonix-backend.onrender.com/api/address",
          newAddress,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      toast.success(
        editingAddressId
          ? "Address updated successfully"
          : "Address added successfully"
      );
      await fetchAddresses();
      setShowForm(false);
      setEditingAddressId(null);

      setNewAddress({
        fullName: "",
        phoneNumber: "",
        streetAddress: "",
        city: "",
        state: "",
        pincode: "",
        isDefault: false,
      });
    } catch (error) {
      console.log(error);
      toast.error("Failed to add address");
    }
  };

  const handleSetDefault = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `https://zovaonix-backend.onrender.com/api/address/default/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await fetchAddresses();
      toast.success("Default address updated");
    } catch (error) {
      console.log(error);
      toast.error("Failed to update default address");
    }
  };

  const handleDeleteAddress = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await axios.delete(
        `https://zovaonix-backend.onrender.com/api/address/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Address deleted successfully");
      await fetchAddresses();
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete address");
    }
  };

  const handleEditAddress = (addr) => {
    setEditingAddressId(addr._id);

    setNewAddress({
      fullName: addr.fullName || "",
      phoneNumber: addr.phoneNumber || "",
      streetAddress: addr.streetAddress || "",
      city: addr.city || "",
      state: addr.state || "",
      pincode: addr.pincode || "",
      isDefault: addr.isDefault || false,
    });

    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  return (
    <div className="mx-auto max-w-7xl p-2 min-[564px]:p-4">
      <div className="flex items-start gap-4 min-[564px]:gap-6">
        {/* Address Content */}
        <main className="min-w-0 flex-1">

          {/* Mobile Account Menu: below 564px */}
          <div className="mb-4 min-[564px]:hidden">
            <button
              onClick={() => setMenuOpen(true)}
              className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm"
            >
              <FaBars />
              My Account
            </button>
          </div>

          {/* Mobile Side Drawer */}
          {menuOpen && (
            <div className="fixed inset-0 z-50 min-[564px]:hidden">
              {/* Overlay */}
              <div
                className="absolute inset-0 bg-black/40"
                onClick={() => setMenuOpen(false)}
              />

              {/* Drawer */}
              <div className="absolute left-0 top-0 h-full w-72 max-w-[85%] overflow-y-auto bg-white p-4 shadow-xl">
                <div className="mb-4 flex justify-end">
                  <button
                    onClick={() => setMenuOpen(false)}
                    className="rounded-lg p-2 text-gray-700"
                    aria-label="Close menu"
                  >
                    <FaTimes size={20} />
                  </button>
                </div>

              </div>
            </div>
          )}

          {/* Heading */}
          <div className="mb-4 flex items-center justify-between gap-2 min-[564px]:mb-6">
            <h1 className="text-primary text-lg font-bold min-[400px]:text-xl min-[564px]:text-2xl">
              My Addresses
            </h1>

            <button
              onClick={() => setShowForm(!showForm)}
              className="shrink-0 rounded-lg bg-primary px-2.5 py-2 text-xs text-white hover:bg-primary-dull min-[400px]:px-4 min-[400px]:text-sm"
            >
              + Add Address
            </button>
          </div>

          {/* Add Address Form */}
          {showForm && (
            <div className="mb-5 rounded-xl border bg-white p-3 min-[400px]:p-4 min-[564px]:mb-6 min-[564px]:p-6">
              <h2 className="text-primary mb-4 text-base font-semibold min-[400px]:text-lg">
                {editingAddressId ? "Edit Address" : "Add New Address"}
              </h2>

              <form
                onSubmit={handleAddAddress}
                className="space-y-3 min-[400px]:space-y-4"
              >
                <div className="grid grid-cols-1 gap-3 min-[400px]:gap-4 min-[750px]:grid-cols-2">
                  <input
                    type="text"
                    placeholder="Full Name *"
                    value={newAddress.fullName}
                    onChange={(e) =>
                      setNewAddress((p) => ({
                        ...p,
                        fullName: e.target.value,
                      }))
                    }
                    className="min-w-0 rounded-lg border p-2.5 text-sm focus:ring-2 focus:ring-black min-[400px]:p-3 min-[400px]:text-base"
                    required
                  />

                  <input
                    type="tel"
                    placeholder="Phone Number *"
                    value={newAddress.phoneNumber}
                    onChange={(e) =>
                      setNewAddress((p) => ({
                        ...p,
                        phoneNumber: e.target.value,
                      }))
                    }
                    className="min-w-0 rounded-lg border p-2.5 text-sm focus:ring-2 focus:ring-black min-[400px]:p-3 min-[400px]:text-base"
                    required
                  />

                  <input
                    type="text"
                    placeholder="City *"
                    value={newAddress.city}
                    onChange={(e) =>
                      setNewAddress((p) => ({
                        ...p,
                        city: e.target.value,
                      }))
                    }
                    className="min-w-0 rounded-lg border p-2.5 text-sm focus:ring-2 focus:ring-black min-[400px]:p-3 min-[400px]:text-base"
                    required
                  />

                  <input
                    type="text"
                    placeholder="State *"
                    value={newAddress.state}
                    onChange={(e) =>
                      setNewAddress((p) => ({
                        ...p,
                        state: e.target.value,
                      }))
                    }
                    className="min-w-0 rounded-lg border p-2.5 text-sm focus:ring-2 focus:ring-black min-[400px]:p-3 min-[400px]:text-base"
                    required
                  />

                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="Pincode *"
                    value={newAddress.pincode}
                    onChange={(e) =>
                      setNewAddress((p) => ({
                        ...p,
                        pincode: e.target.value,
                      }))
                    }
                    className="min-w-0 rounded-lg border p-2.5 text-sm focus:ring-2 focus:ring-black min-[400px]:p-3 min-[400px]:text-base"
                    required
                  />
                </div>

                <textarea
                  placeholder="Complete Address *"
                  value={newAddress.streetAddress}
                  onChange={(e) =>
                    setNewAddress((p) => ({
                      ...p,
                      streetAddress: e.target.value,
                    }))
                  }
                  rows={3}
                  className="w-full min-w-0 rounded-lg border p-2.5 text-sm focus:ring-2 focus:ring-black min-[400px]:p-3 min-[400px]:text-base"
                  required
                />

                <div className="flex flex-wrap items-center justify-between gap-3">
                  <label className="flex cursor-pointer items-center gap-2 text-xs min-[400px]:text-sm">
                    <input
                      type="checkbox"
                      checked={newAddress.isDefault}
                      onChange={(e) =>
                        setNewAddress((p) => ({
                          ...p,
                          isDefault: e.target.checked,
                        }))
                      }
                      className="h-4 w-4 shrink-0"
                    />
                    Set as default
                  </label>

                  <button
                    type="submit"
                    className="rounded-lg bg-primary px-4 py-2 text-xs text-white hover:bg-primary-dull min-[400px]:px-6 min-[400px]:text-sm"
                  >
                    {editingAddressId ? "Save Changes" : "Save Address"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Saved Address Cards */}
          <div className="grid grid-cols-1 gap-3 min-[400px]:gap-4 min-[900px]:grid-cols-2">
            {addresses.map((addr) => (
              <div
                key={addr._id}
                className={`min-w-0 rounded-xl border p-3 min-[400px]:p-4 min-[564px]:p-5 ${addr.isDefault ? "border-2 border-[#800020]" : ""
                  }`}
              >
                {addr.isDefault && (
                  <span className="mb-2 inline-block rounded-full bg-primary px-2.5 py-1 text-[10px] text-white min-[400px]:text-xs">
                    Default
                  </span>
                )}

                <div className="mb-3 min-w-0">
                  <div className="mb-2 flex min-w-0 items-start justify-between gap-2">
                    <h3 className="min-w-0 break-words text-sm font-semibold min-[400px]:text-base">
                      {addr.fullName}
                    </h3>

                    <div className="flex shrink-0 flex-col items-end gap-1 min-[400px]:flex-row min-[400px]:gap-2">
                      {!addr.isDefault && (
                        <button
                          onClick={() => handleSetDefault(addr._id)}
                          className="text-[10px] text-blue-600 hover:text-blue-800 min-[400px]:text-xs"
                        >
                          Set Default
                        </button>
                      )}
                      <button
                        onClick={() => handleEditAddress(addr)}
                        className="text-[10px] text-primary hover:underline min-[400px]:text-xs"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => {
                          if (window.confirm("Delete address?")) {
                            handleDeleteAddress(addr._id);
                          }
                        }}
                        className="text-[10px] text-red-600 hover:text-red-800 min-[400px]:text-xs"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  <p className="mb-1 break-words text-xs text-gray-600 min-[400px]:text-sm">
                    {addr.phoneNumber}
                  </p>

                  <p className="break-words text-xs leading-5 text-gray-700 min-[400px]:text-sm min-[564px]:leading-6">
                    {addr.streetAddress}
                  </p>

                  <p className="mt-1 break-words text-xs text-gray-600 min-[400px]:text-sm">
                    {[addr.city, addr.state, addr.pincode]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                </div>

                {!addr.isDefault && (
                  <button
                    onClick={() => handleSetDefault(addr._id)}
                    className="w-full rounded-lg border border-black py-1.5 text-xs text-black hover:bg-primary hover:text-white min-[400px]:py-2 min-[400px]:text-sm"
                  >
                    Deliver Here
                  </button>
                )}
              </div>
            ))}
          </div>

        </main>
      </div>
    </div>
  );
};

export default AddressPage;
