function ConnectionStatus({ status }) {
    return (
        <div style={{
            position: 'absolute', 
            top: '10px', 
            right: '10px',
            backgroundColor: status === 'connected' ? '#4CAF50' : '#f44336',
            color: 'white',
            padding: '5px 10px',
            borderRadius: '4px',
            fontSize: '12px'
        }}>
            {status === 'connected' ? 'Connected' : 'Disconnected'}
        </div>
    );
}

export default ConnectionStatus;