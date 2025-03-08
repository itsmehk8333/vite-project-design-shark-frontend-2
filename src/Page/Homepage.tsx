import axios, { AxiosResponse } from "axios";
import React, { useEffect, useState } from "react";
import { Grid, Card, CardContent, Typography, Button, Dialog, DialogTitle, DialogContent, TextField, DialogActions } from "@mui/material";
import FolderIcon from "@mui/icons-material/Folder";
import AddIcon from "@mui/icons-material/Add";
import api from "../Auth/axiosInstance";
import { useNavigate, useLocation } from "react-router-dom"; // Added useLocation to track the active folder

// Define the type for a Folder
interface Folder {
  name: string;
  totalItems: number;
}

// Define the API response type based on the current backend response
interface ApiResponse {
  folders: Folder[];
  itemCount?: number;
  message: string;
  prefix: string;
}

// Extend the Axios error type for better error handling
interface AxiosErrorWithMessage {
  message: string;
}

const Homepage: React.FC = () => {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [folderName, setFolderName] = useState<string>("");
  const navigate = useNavigate();
  const location = useLocation(); // Track the current path to determine the active folder

  useEffect(() => {
    const getFolders = async () => {
      try {
        setLoading(true);
        const response: AxiosResponse<ApiResponse> = await api.get<ApiResponse>("/folders/list-folders");
        console.log("API Response:", response.data);
        if (response.status === 200) {
          setFolders(response.data.folders);
        }
      } catch (error) {
        const axiosError = error as AxiosErrorWithMessage;
        console.error("Error fetching folders:", axiosError.message);
      } finally {
        setLoading(false);
      }
    };
    getFolders();
  }, []);

  useEffect(() => {
    console.log(folders, "folders");
  }, [folders]);

  const handleOpenModal = (): void => {
    setOpenModal(true);
  };

  const handleCloseModal = (): void => {
    setOpenModal(false);
    setFolderName("");
  };

  const handleCreateFolder = async (): Promise<void> => {
    if (!folderName.trim()) {
      alert("Please enter a folder name");
      return;
    }
    try {
      await api.post("/folders/create-folder", { folderName });
      const response: AxiosResponse<ApiResponse> = await api.get<ApiResponse>("/folders/list-folders");
      console.log("API Response after create:", response.data);
      if (response.status === 200) {
        setFolders(response.data.folders);
      }
      handleCloseModal();
    } catch (error) {
      const axiosError = error as AxiosErrorWithMessage;
      console.error("Error creating folder:", axiosError.message);
      alert("Failed to create folder");
    }
  };

  const handleFolderNameChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setFolderName(event.target.value);
  };

  // Determine the active folder based on the current path
  const getActiveFolder = () => {
    const path = location.pathname.split("/").pop();
    return path === "allfolders" || !path ? "All Files" : path;
  };

  return (
    <div className="homepage" style={{ padding: 20, backgroundColor: "#1a1a1a", position: "relative", minHeight: "100vh", display: "flex" }}>
      {/* Sidebar */}
      <div
        style={{
          width: "200px",
          backgroundColor: "#000",
          padding: "20px 0",
          borderRadius: "5px",
          height: "calc(100vh - 40px)",
          overflowY: "auto",
        }}
      >
        <Typography
          variant="h6"
          component="div"
          sx={{
            backgroundColor: getActiveFolder() === "All Files" ? "#ff4444" : "transparent",
            color: "#fff",
            padding: "10px",
            marginBottom: "10px",
            borderRadius: "5px",
            cursor: "pointer",
          }}
          onClick={() => navigate("/allfolders")}
        >
          All Files
        </Typography>
        {folders.map((folder, index) => (
          <Typography
            key={index}
            variant="body1"
            component="div"
            sx={{
              backgroundColor: getActiveFolder() === folder.name ? "#ff4444" : "transparent",
              color: "#fff",
              padding: "10px",
              marginBottom: "5px",
              borderRadius: "5px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
            }}
            onClick={() => navigate(`/allfolders/${folder.name}`)}
          >
            <span style={{ marginRight: "8px" }}>📁</span>
            {folder.name}
          </Typography>
        ))}
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, marginLeft: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <Typography variant="h4" component="h2" gutterBottom sx={{ color: "#fff" }}>
            {getActiveFolder()}
          </Typography>
          <Button
            variant="contained"
            color="error"
            onClick={handleOpenModal}
            sx={{ backgroundColor: "#ff4444", "&:hover": { backgroundColor: "#cc0000" } }}
          >
            + Create Folder
          </Button>
        </div>
        {loading ? (
          <Typography sx={{ color: "#fff" }}>Loading...</Typography>
        ) : folders.length === 0 ? (
          <Typography sx={{ color: "#fff" }}>No folders exist</Typography>
        ) : (
          <Grid container spacing={3}>
            {folders.map((folder, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                <Card
                  sx={{
                    backgroundColor: "#2a2a2a",
                    color: "#fff",
                    textAlign: "center",
                    transition: "transform 0.2s",
                    "&:hover": {
                      transform: "scale(1.05)",
                    },
                  }}
                  onClick={() => navigate(`/allfolders/${folder.name}`)}
                >
                  <CardContent>
                    <FolderIcon sx={{ fontSize: 80, color: "#444" }} />
                    <Typography variant="h6" component="div" sx={{ mt: 2 }}>
                      {folder.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#888" }}>
                      Total Items: {folder.totalItems <= 0 ? 0 : folder.totalItems}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Modal for Creating Folder */}
        <Dialog
          open={openModal}
          onClose={handleCloseModal}
          PaperProps={{
            style: {
              position: "absolute",
              bottom: 20,
              right: 20,
              width: "300px",
              backgroundColor: "#333",
              color: "#fff",
              borderRadius: "8px",
              boxShadow: "0 0 10px rgba(0,0,0,0.5)",
            },
          }}
        >
          <DialogTitle
            sx={{
              backgroundColor: "#ff4444",
              color: "#fff",
              textAlign: "center",
              padding: "10px",
            }}
          >
            Add Folder
            <Button
              onClick={handleCloseModal}
              sx={{ position: "absolute", right: 8, top: 8, color: "#fff" }}
            >
              X
            </Button>
          </DialogTitle>
          <DialogContent>
            <div style={{ textAlign: "center", margin: "20px 0" }}></div>
            <TextField
              autoFocus
              margin="dense"
              label="Folder Name"
              type="text"
              fullWidth
              value={folderName}
              onChange={handleFolderNameChange}
              sx={{
                backgroundColor: "#444",
                "& .MuiInputBase-input": { color: "#fff" },
                "& .MuiInputLabel-root": { color: "#888" },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "#666" },
                  "&:hover fieldset": { borderColor: "#888" },
                  "&.Mui-focused fieldset": { borderColor: "#757de8" },
                },
              }}
            />
          </DialogContent>
          <DialogActions
            sx={{ justifyContent: "space-between", padding: "10px", backgroundColor: "#333" }}
          >
            <Button
              onClick={handleCloseModal}
              sx={{ color: "#fff", backgroundColor: "#444", "&:hover": { backgroundColor: "#555" } }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateFolder}
              sx={{ color: "#fff", backgroundColor: "#ff4444", "&:hover": { backgroundColor: "#cc0000" } }}
            >
              Create
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
};

export default Homepage;