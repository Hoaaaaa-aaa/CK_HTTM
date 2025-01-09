import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const SupersetChart = () => {
    // Di chuyển các biến môi trường vào .env
    const SUPERSET_URL = process.env.REACT_APP_SUPERSET_URL || "https://f8f472ba.us2a.app.preset.io";
    const DASHBOARD_ID = process.env.REACT_APP_DASHBOARD_ID || "6b072f55-bf3b-473f-9145-20e8a68cb390";
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Xử lý sự kiện khi iframe load xong
        const handleIframeLoad = () => {
            setLoading(false);
        };

        window.addEventListener('message', (event) => {
            // Kiểm tra origin để đảm bảo an toàn
            if (event.origin === SUPERSET_URL) {
                // Xử lý các message từ Superset dashboard nếu cần
                console.log('Message from Superset:', event.data);
            }
        });

        return () => {
            // Cleanup event listeners
            window.removeEventListener('message', handleIframeLoad);
        };
    }, [SUPERSET_URL]);

    return (
        <EmbedStyled>
            {loading && <LoadingSpinner>Loading...</LoadingSpinner>}
            <iframe
                src={`${SUPERSET_URL}/embedded/${DASHBOARD_ID}`}
                title="Superset Dashboard"
                frameBorder="0"
                allowFullScreen
                onLoad={() => setLoading(false)}
                style={{ opacity: loading ? 0 : 1 }}
            />
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

const LoadingSpinner = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    // Thêm styles cho loading spinner
`;

export default SupersetChart;