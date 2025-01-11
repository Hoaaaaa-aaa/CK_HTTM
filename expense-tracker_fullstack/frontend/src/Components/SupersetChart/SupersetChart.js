import React, { useEffect } from 'react';
import styled from 'styled-components';
import { embedDashboard } from "@superset-ui/embedded-sdk";
import axios from 'axios';

const SupersetChart = () => {
    // Di chuyển các biến môi trường vào .env
    const SUPERSET_URL = process.env.REACT_APP_SUPERSET_URL || "http://103.238.235.121:8088";
    const DASHBOARD_ID = process.env.REACT_APP_DASHBOARD_ID || "19afb03c-a46e-4def-9954-42875193283d";

    useEffect(() => {
        const fetchGuestTokenFromBackend = async () => {
            const response = await axios.get('http://localhost:5000/api/v1/get-guest-token')
            return response.data;
        };

        const mountPoint = document.getElementById("my-superset-container");
        if (mountPoint) {
            embedDashboard({
                id: DASHBOARD_ID,
                supersetDomain: SUPERSET_URL,
                mountPoint: mountPoint,
                fetchGuestToken: fetchGuestTokenFromBackend,
                dashboardUiConfig: { hideTitle: true },
            }).catch((error) => {
                console.error("Error embedding Superset dashboard:", error);
            });
        }
    }, [SUPERSET_URL, DASHBOARD_ID]);

    return (
        <EmbedStyled>
            <div id="my-superset-container" style={{width: '100%', height: '100%'}}>
            </div>
        </EmbedStyled>
    );
};

const EmbedStyled = styled.div`
    position: relative;
    width: 100%;
    height: 400px; // Điều chỉnh chiều cao phù hợp với layout
    
    iframe {
        width: 100%;
        height: 100%;
        border: none;
        transition: opacity 0.3s ease;
    }
`;

export default SupersetChart;
