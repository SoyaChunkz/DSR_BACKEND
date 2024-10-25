const Department = require("../models/dsr.model");


//create department
exports.handleCreateDepartment = async (req, res) => {
  const departmentData = req.body;

  try {
    const newDepartment = new Department(departmentData);
    await newDepartment.save();
    res.status(201).json({ message: 'Department structure created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

//get all deparments
exports.handleAllDepartments = async (req, res) => {
    try {
        const departments = await Department.find();
        res.json(departments);
      } catch (error) {
        console.error('Error fetching departments:', error);
        res.status(500).json({
          error: true,
          message: 'Internal Server Error',
        });
      }
}

//edit department
exports.handleUpdateDepartment = async (req, res) => {
    const { department_id } = req.params;
    const updatedDepartmentData = req.body;
  
    try {
      const department = await Department.findByIdAndUpdate(
        department_id,
        updatedDepartmentData,
        { new: true } // Return the updated document
      );
  
      if (!department) {
        return res.status(404).json({
          error: true,
          message: 'Department not found',
        });
      }
  
      res.json({
        error: false,
        message: 'Department updated successfully',
        department,
      });
    } catch (error) {
      console.error('Error updating department:', error);
      res.status(500).json({
        error: true,
        message: 'Internal Server Error',
      });
    }
}

//delete department
exports.handleDeleteDepartment = async (req, res) => {
    const { department_id } = req.params;

    try {
      // Find the department by ID and delete it
      const deletedDepartment = await Department.findByIdAndDelete(department_id);
  
      if (!deletedDepartment) {
        return res.status(404).json({ error: 'Department not found' });
      }
  
      res.status(200).json({ message: 'Department deleted successfully' });
    } catch (error) {
      console.error('Error deleting department:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
}

//delete lab
exports.handleDeleteLab = async (req, res) => {
    const { department_id, lab_id } = req.params;

  try {
    const department = await Department.findById(department_id);

    if (!department) {
      return res.status(404).json({ error: 'Department not found' });
    }

    const labIndex = department.labs.findIndex(lab => lab._id.toString() === lab_id);
    if (labIndex === -1) {
      return res.status(404).json({ error: 'Lab not found' });
    }

    department.labs.splice(labIndex, 1); // Remove lab from the array
    await department.save();
    
    res.status(200).json({ message: 'Lab deleted successfully' });
  } catch (error) {
    console.error('Error deleting lab:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

//delete section
exports.handleDeleteSection = async (req, res) => {
    const { department_id, lab_id, section_id } = req.params;

    try {
      const department = await Department.findById(department_id);
  
      if (!department) {
        return res.status(404).json({ error: 'Department not found' });
      }
  
      const lab = department.labs.id(lab_id);
      if (!lab) {
        return res.status(404).json({ error: 'Lab not found' });
      }
  
      const sectionIndex = lab.sections.findIndex(section => section._id.toString() === section_id);
      if (sectionIndex === -1) {
        return res.status(404).json({ error: 'Section not found' });
      }
  
      lab.sections.splice(sectionIndex, 1); // Remove section from the array
      await department.save();
      
      res.status(200).json({ message: 'Section deleted successfully' });
    } catch (error) {
      console.error('Error deleting section:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
}