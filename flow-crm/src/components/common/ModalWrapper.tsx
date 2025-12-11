'use client';

import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    Typography,
    Box,
    useTheme,
    useMediaQuery
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

interface ModalWrapperProps {
    open: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    actions?: React.ReactNode;
    maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

const ModalWrapper: React.FC<ModalWrapperProps> = ({
    open,
    onClose,
    title,
    children,
    actions,
    maxWidth = 'sm'
}) => {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth={maxWidth}
            fullScreen={fullScreen}
            PaperProps={{
                sx: {
                    borderRadius: 2,
                    backgroundImage: 'none'
                }
            }}
        >
            <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" component="div" fontWeight={600}>
                    {title}
                </Typography>
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent dividers sx={{ p: 3 }}>
                {children}
            </DialogContent>
            {actions && (
                <DialogActions sx={{ p: 2 }}>
                    {actions}
                </DialogActions>
            )}
        </Dialog>
    );
};

export default ModalWrapper;
