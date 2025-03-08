import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import api from '../Auth/axiosInstance';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Typography } from '@mui/material';

interface S3File {
    name: string;
    key: string;
    size: number;
    url: string;
}

interface Folder {
    name: string;
    totalItems: number;
}

interface ApiResponse {
    folders: Folder[];
    itemCount?: number;
    message: string;
    prefix: string;
}

function FilesPage() {
    const { foldername } = useParams<{ foldername: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const [files, setFiles] = useState<S3File[]>([]);
    const [folders, setFolders] = useState<Folder[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [fileName, setFileName] = useState<string>('');
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
    const [editFile, setEditFile] = useState<S3File | null>(null);
    const [newFileName, setNewFileName] = useState<string>('');
    const [isLargeViewOpen, setIsLargeViewOpen] = useState<boolean>(false);
    const [selectedLargeFile, setSelectedLargeFile] = useState<S3File | null>(null);

    useEffect(() => {
        console.log(files, 'files');
    }, [files]);

    useEffect(() => {
        const fetchFoldersAndFiles = async () => {
            setLoading(true);
            setError(null);

            try {
                const folderResponse = await api.get<ApiResponse>('/folders/list-folders');
                console.log('Fetched folders:', folderResponse.data);
                setFolders(folderResponse.data.folders || []);

                if (!foldername) {
                    setError('No folder name provided');
                    setLoading(false);
                    return;
                }

                const fileResponse = await api.get(`/files/${foldername}`);
                console.log('Fetched files:', fileResponse.data);
                setFiles(fileResponse.data.files || []);
            } catch (err) {
                setError('Failed to fetch data');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchFoldersAndFiles();
    }, [foldername]);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedFile(null);
        setFileName('');
        setUploadError(null);
    };

    const openEditModal = (file: S3File) => {
        setEditFile(file);
        setNewFileName(file.name);
        setIsEditModalOpen(true);
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setEditFile(null);
        setNewFileName('');
    };

    const openLargeView = (file: S3File) => {
        setSelectedLargeFile(file);
        setIsLargeViewOpen(true);
    };

    const closeLargeView = () => {
        setIsLargeViewOpen(false);
        setSelectedLargeFile(null);
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            if (!fileName) {
                setFileName(file.name);
            }
        }
    };

    const handleAddFile = async () => {
        if (!selectedFile || !foldername) {
            setUploadError('Please select a file and ensure a folder is specified.');
            return;
        }

        try {
            const response = await api.post('/files/upload', {
                name: `${foldername}/${fileName || selectedFile.name}`,
                contentType: selectedFile.type,
                folder: foldername,
            });

            const { uploadUrl, key } = response.data;

            await fetch(uploadUrl, {
                method: 'PUT',
                body: selectedFile,
                headers: {
                    'Content-Type': selectedFile.type,
                },
            });

            await api.post('/files/confirm-upload', {
                key,
                size: selectedFile.size,
                fileType: selectedFile.type,
                folder: foldername,
            });

            const fetchResponse = await api.get(`/files/${foldername}`);
            setFiles(fetchResponse.data.files || []);
            closeModal();
        } catch (err) {
            console.error('File upload error:', err);
            setUploadError('Failed to upload file. Please try again.');
        }
    };

    const handleDeleteFile = async (fileKey: string) => {
        if (!window.confirm(`Are you sure you want to delete ${fileKey.split('/').pop()}?`)) {
            return;
        }

        try {
            await api.delete('/files/delete', {
                data: { key: fileKey },
            });

            const fetchResponse = await api.get(`/files/${foldername}`);
            setFiles(fetchResponse.data.files || []);
        } catch (err) {
            console.error('File delete error:', err);
            alert('Failed to delete file. Please try again.');
        }
    };

    const handleEditFile = async () => {
        if (!editFile || !newFileName || newFileName === editFile.name) {
            closeEditModal();
            return;
        }

        try {
            await api.put('/files/rename', {
                oldKey: editFile.key,
                newName: newFileName,
            });

            const fetchResponse = await api.get(`/files/${foldername}`);
            setFiles(fetchResponse.data.files || []);
            closeEditModal();
        } catch (err) {
            console.error('File rename error:', err);
            alert('Failed to rename file. Please try again.');
        }
    };

    const isImage = (fileName: string) => /\.(jpg|jpeg|png|gif)$/i.test(fileName);

    const getActiveFolder = () => {
        const path = location.pathname.split("/").pop();
        return path === "allfolders" || !path ? "All Files" : path;
    };

    return (
        <div style={{ padding: '20px', backgroundColor: '#1a1a1a', color: '#fff', display: 'flex' }}>
            {/* Sidebar */}
            <div
                style={{
                    width: '200px',
                    backgroundColor: '#000',
                    padding: '20px 0',
                    borderRadius: '5px',
                    height: 'calc(100vh - 40px)',
                    overflowY: 'auto',
                }}
            >
                <Typography
                    variant="h6"
                    component="div"
                    sx={{
                        backgroundColor: getActiveFolder() === 'All Files' ? '#ff4444' : 'transparent',
                        color: '#fff',
                        padding: '10px',
                        marginBottom: '10px',
                        borderRadius: '5px',
                        cursor: 'pointer',
                    }}
                    onClick={() => navigate('/allfolders')}
                >
                    All Files
                </Typography>
                {folders.map((folder, index) => (
                    <Typography
                        key={index}
                        variant="body1"
                        component="div"
                        sx={{
                            backgroundColor: getActiveFolder() === folder.name ? '#ff4444' : 'transparent',
                            color: '#fff',
                            padding: '10px',
                            marginBottom: '5px',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                        }}
                        onClick={() => navigate(`/allfolders/${folder.name}`)}
                    >
                        <span style={{ marginRight: '8px' }}>📁</span>
                        {folder.name}
                    </Typography>
                ))}
            </div>

            {/* Main Content */}
            <div style={{ flex: 1, marginLeft: '20px' }}>
                <h1 style={{ fontSize: '24px', marginBottom: '20px' }}>
                    DEZIGN SHARK - {foldername}
                    <span style={{ fontSize: '12px' }}> - ALL ABOUT DESIGN</span>
                </h1>

                <div
                    style={{
                        backgroundColor: '#000',
                        padding: '10px 20px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '20px',
                        borderRadius: '5px',
                    }}
                >
                    <span style={{ color: '#999' }}>{files.length} file(s) available</span>
                    <div>
                        <button style={{ background: 'none', border: 'none', color: '#fff', marginRight: '10px', cursor: 'pointer' }}>
                            <span role="img" aria-label="share">↻</span>
                        </button>
                        <button style={{ background: 'none', border: 'none', color: '#fff', marginRight: '10px', cursor: 'pointer' }}>
                            <span role="img" aria-label="grid">□</span>
                        </button>
                        <button style={{ background: 'none', border: 'none', color: '#fff', marginRight: '10px', cursor: 'pointer' }}>
                            <span role="img" aria-label="list">≡</span>
                        </button>
                        <button
                            style={{
                                backgroundColor: '#ff0000',
                                color: '#fff',
                                padding: '5px 15px',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                marginRight: '10px',
                            }}
                            onClick={openModal}
                        >
                            Add File <span role="img" aria-label="add">➕</span>
                        </button>
                        <button
                            style={{
                                backgroundColor: '#ff0000',
                                color: '#fff',
                                padding: '5px 15px',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer',
                            }}
                            onClick={openModal}
                        >
                            Add Files <span role="img" aria-label="add">➕</span>
                        </button>
                    </div>
                </div>

                <div style={{ padding: '20px', height: '100vh' }}>
                    {loading ? (
                        <div style={{ textAlign: 'center', color: '#999', fontSize: '18px' }}>
                            Loading files...
                        </div>
                    ) : error ? (
                        <div style={{ textAlign: 'center', color: '#ff0000', fontSize: '18px' }}>
                            Error: {error}
                        </div>
                    ) : files.length === 0 ? (
                        <div style={{ textAlign: 'center', color: '#999', fontSize: '18px' }}>
                            No files found in this folder
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
                            {files.map((file, index) => (
                                <div
                                    key={index}
                                    style={{
                                        position: 'relative',
                                        backgroundColor: '#333',
                                        padding: '10px',
                                        textAlign: 'center',
                                        borderRadius: '5px',
                                        cursor: 'pointer',
                                    }}
                                    onClick={() => openLargeView(file)}
                                >
                                    {isImage(file.name) ? (
                                        <img
                                            src={file.url}
                                            alt={file.name}
                                            style={{ width: '100%', height: 'auto', borderRadius: '5px' }}
                                            onError={(e) => (e.currentTarget.style.display = 'none')}
                                        />
                                    ) : (
                                        <div
                                            style={{
                                                width: '100%',
                                                height: '150px',
                                                backgroundColor: '#555',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                borderRadius: '5px',
                                            }}
                                        >
                                            <span>{file.name.split('.').pop()?.toUpperCase()} File</span>
                                        </div>
                                    )}
                                    <div style={{ marginTop: '10px', color: '#ccc' }}>
                                        {file.name}
                                        <br />
                                        {(file.size / 1024).toFixed(2)} KB
                                    </div>
                                    <span
                                        style={{
                                            position: 'absolute',
                                            top: '10px',
                                            right: '40px',
                                            color: '#fff',
                                            padding: '2px 6px',
                                            borderRadius: '50%',
                                            cursor: 'pointer',
                                        }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            openEditModal(file);
                                        }}
                                    >
                                        <EditIcon sx={{ color: '#ff0000' }} />
                                    </span>
                                    <span
                                        style={{
                                            position: 'absolute',
                                            top: '10px',
                                            right: '10px',
                                            color: '#fff',
                                            padding: '2px 6px',
                                            borderRadius: '50%',
                                            cursor: 'pointer',
                                        }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteFile(file.key);
                                        }}
                                    >
                                        <DeleteIcon sx={{ color: '#ff0000' }} />
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Add File Modal */}
                {isModalOpen && (
                    <div
                        style={{
                            position: 'fixed',
                            top: '0',
                            left: '0',
                            width: '100%',
                            height: '100%',
                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <div
                            style={{
                                backgroundColor: '#2a2a2a',
                                padding: '20px',
                                borderRadius: '5px',
                                width: '300px',
                                textAlign: 'center',
                            }}
                        >
                            <h3 style={{ color: '#ff0000', marginBottom: '20px' }}>Add File</h3>
                            <div
                                style={{
                                    border: '2px dashed #666',
                                    padding: '20px',
                                    textAlign: 'center',
                                    marginBottom: '20px',
                                    color: '#999',
                                }}
                                onClick={() => document.getElementById('fileInput')?.click()}
                            >
                                <span style={{ fontSize: '40px' }}>+</span>
                                <p>Drag & drop a file here, or click to select one</p>
                                <input
                                    type="file"
                                    id="fileInput"
                                    style={{ display: 'none' }}
                                    onChange={handleFileChange}
                                />
                            </div>
                            {selectedFile && (
                                <p style={{ color: '#ccc', marginBottom: '10px' }}>
                                    Selected: {selectedFile.name}
                                </p>
                            )}
                            <input
                                type="text"
                                placeholder="File Name"
                                value={fileName}
                                onChange={(e) => setFileName(e.target.value)}
                                style={{ width: '100%', padding: '10px', marginBottom: '20px', backgroundColor: '#333', border: 'none', color: '#fff' }}
                            />
                            {uploadError && (
                                <p style={{ color: '#ff0000', marginBottom: '10px' }}>{uploadError}</p>
                            )}
                            <div style={{ textAlign: 'center' }}>
                                <button
                                    style={{ padding: '10px 20px', backgroundColor: '#333', color: '#fff', border: 'none', marginRight: '10px' }}
                                    onClick={closeModal}
                                >
                                    Cancel
                                </button>
                                <button
                                    style={{ padding: '10px 20px', backgroundColor: '#ff0000', color: '#fff', border: 'none' }}
                                    onClick={handleAddFile}
                                >
                                    Add File
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Edit File Modal */}
                {isEditModalOpen && (
                    <div
                        style={{
                            position: 'fixed',
                            top: '0',
                            left: '0',
                            width: '100%',
                            height: '100%',
                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <div
                            style={{
                                backgroundColor: '#2a2a2a',
                                padding: '20px',
                                borderRadius: '5px',
                                width: '300px',
                                textAlign: 'center',
                            }}
                        >
                            <h3 style={{ color: '#ff0000', marginBottom: '20px' }}>Edit File Name</h3>
                            <input
                                type="text"
                                value={newFileName}
                                onChange={(e) => setNewFileName(e.target.value)}
                                style={{ width: '100%', padding: '10px', marginBottom: '20px', backgroundColor: '#333', border: 'none', color: '#fff' }}
                            />
                            <div style={{ textAlign: 'center' }}>
                                <button
                                    style={{ padding: '10px 20px', backgroundColor: '#333', color: '#fff', border: 'none', marginRight: '10px' }}
                                    onClick={closeEditModal}
                                >
                                    Cancel
                                </button>
                                <button
                                    style={{ padding: '10px 20px', backgroundColor: '#ff0000', color: '#fff', border: 'none' }}
                                    onClick={handleEditFile}
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Large View Modal */}
                {isLargeViewOpen && selectedLargeFile && (
                    <div
                        style={{
                            position: 'fixed',
                            top: '0',
                            left: '0',
                            width: '100%',
                            height: '100%',
                            backgroundColor: 'rgba(0, 0, 0, 0.9)',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            zIndex: 1000,
                        }}
                    >
                        <div
                            style={{
                                position: 'relative',
                                textAlign: 'center',
                                maxWidth: '90%',
                                maxHeight: '90vh',
                                overflow: 'auto',
                            }}
                        >
                            {isImage(selectedLargeFile.name) ? (
                                <img
                                    src={selectedLargeFile.url}
                                    alt={selectedLargeFile.name}
                                    style={{
                                        maxWidth: '100%',
                                        maxHeight: '80vh',
                                        borderRadius: '5px',
                                        objectFit: 'contain',
                                    }}
                                    onError={(e) => (e.currentTarget.style.display = 'none')}
                                />
                            ) : (
                                <div
                                    style={{
                                        backgroundColor: '#555',
                                        padding: '20px',
                                        borderRadius: '5px',
                                        color: '#fff',
                                    }}
                                >
                                    <h3>{selectedLargeFile.name}</h3>
                                    <p>Size: {(selectedLargeFile.size / 1024).toFixed(2)} KB</p>
                                    <p>This file type cannot be previewed. Click to view.</p>
                                    <a href={selectedLargeFile.url} download={selectedLargeFile.name} style={{ color: '#ff0000' }}>
                                        View
                                    </a>
                                </div>
                            )}
                            <button
                                style={{
                                    position: 'absolute',
                                    top: '10px',
                                    right: '10px',
                                    backgroundColor: '#ff0000',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '50%',
                                    width: '30px',
                                    height: '30px',
                                    cursor: 'pointer',
                                    fontSize: '16px',
                                }}
                                onClick={closeLargeView}
                            >
                                X
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default FilesPage;