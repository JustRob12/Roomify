exports.create = (req, res) => {
    try {
        // TODO: Add your classroom creation logic here
        const { name, capacity, building, floor, type } = req.body;
        
        // For now, just echo back the received data
        res.status(201).json({ 
            message: "Classroom created successfully",
            data: { name, capacity, building, floor, type }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};