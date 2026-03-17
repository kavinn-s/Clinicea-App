async function testServices() {
    try {
        const res = await fetch('http://localhost:5000/api/services');
        const data = await res.json();
        console.log('Services from Backend:', data);
    } catch (err) {
        console.error('Error fetching services:', err.message);
    }
}
testServices();
