const Department = require("../models/dsr.model");
const jwt = require("jsonwebtoken")

//get all entries
exports.handleAllEntries = async (req, res) => {
  const { department, lab, section } = req.query;

  try {
    const departmentData = await Department.findOne({ deptName: department });
    if (!departmentData) return res.json({ entries: [] });

    const labData = departmentData.labs.find(labObj => labObj.labName === lab);
    if (!labData) return res.json({ entries: [] });

    const sectionData = labData.sections.find(sectionObj => sectionObj.sectionName === section);
    if (!sectionData) return res.json({ entries: [] });

    return res.json({ entries: sectionData.dsrEntries });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "An error occurred while fetching entries." });
  }
}

//add new entry
exports.handleAddNewEntry = async (req, res) => {
// console.log("inside");
const { selectedDept, selectedLab, selectedSection, dsrData } = req.body;
console.log('Received request body:', req.body);

try {
  const department = await Department.findOne({ deptName: selectedDept });
  if (!department) {
    console.error('Department not found');
    return res.status(404).json({ error: 'Department not found' });
  }

  const lab = department.labs.find(lab => lab.labName === selectedLab);
  if (!lab) {
    console.error('Lab not found');
    return res.status(404).json({ error: 'Lab not found' });
  }

  const section = lab.sections.find(section => section.sectionName === selectedSection);
  if (!section) {
    console.error('Section not found');
    return res.status(404).json({ error: 'Section not found' });
  }

  // console.log("found the dept, lab, sec")
  // console.log("before", section.dsrEntries)

  const newEntry = { ...dsrData };
  // console.log("adding", newEntry)
  section.dsrEntries.push(newEntry)
  // console.log("added")
  // console.log("after", section.dsrEntries)

  await department.save();
  // console.log("saved")
  
      res.status(201).json({ message: 'DSR entry added successfully' });
    } catch (err) {
      console.error('Internal server error:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
}

//update an entry
exports.handleUpdateEntry = async (req, res) => {
    const { entryId } = req.params;
    const { selectedDept, selectedLab, selectedSection, updatedData } = req.body;

    // console.log(entryId)
    // console.log(req.body)
  
    try {
      // Find the department by deptName
      const department = await Department.findOne({ deptName: selectedDept });
      if (!department) {
        console.error('Department not found');
        return res.status(404).json({ error: 'Department not found' });
      }
  
      // Find the lab within the department
      const lab = department.labs.find(lab => lab.labName === selectedLab);
      if (!lab) {
        console.error('Lab not found');
        return res.status(404).json({ error: 'Lab not found' });
      }
  
      // Find the section within the lab
      const section = lab.sections.find(section => section.sectionName === selectedSection);
      if (!section) {
        console.error('Section not found');
        return res.status(404).json({ error: 'Section not found' });
      }
      
      // console.log("dept, lab, section found")

      // Find the entry within the section
      const entryIndex = section.dsrEntries.findIndex(entry => entry._id.toString() === entryId);
      console.log(entryIndex)
      if (entryIndex === -1) {
        console.error('DSR entry not found');
        return res.status(404).json({ error: 'DSR entry not found' });
      }
  
      // console.log("before", section.dsrEntries[entryIndex])

      // console.log("adding")

      // Update the entry
      section.dsrEntries[entryIndex] = {
        ...section.dsrEntries[entryIndex],
        ...updatedData,
      };
      
      // console.log("after", section.dsrEntries[entryIndex])

      // Save the department document
      await department.save();
  
      res.status(200).json({ message: 'DSR entry updated successfully' });
    } catch (err) {
      console.error('Internal server error:', err);
      res.status(500).json({ error: 'Internal server error' });
    }  

}

//delete entry
exports.handleDeleteEntry = async (req, res) => {
  const { entryId } = req.params;
  const { selectedDept, selectedLab, selectedSection } = req.query;

  // console.log(entryId)
  // console.log(req.body)

  try {
    // Find the department by deptName
    const department = await Department.findOne({ deptName: selectedDept });
    if (!department) return res.status(404).json({ error: 'Department not found' });

    // Find the specific lab within the department
    const lab = department.labs.find(lab => lab.labName === selectedLab);
    if (!lab) return res.status(404).json({ error: 'Lab not found' });

    // Find the specific section within the lab
    const section = lab.sections.find(section => section.sectionName === selectedSection);
    if (!section) return res.status(404).json({ error: 'Section not found' });

    // Find the DSR entry to delete
    const entryIndex = section.dsrEntries.findIndex(entry => entry._id.toString() === entryId);
    if (entryIndex === -1) return res.status(404).json({ error: 'DSR entry not found' });


    // Remove the entry from the section
    section.dsrEntries.splice(entryIndex, 1);


    // Save the updated department document
    await department.save();

    res.status(200).json({ message: 'DSR entry deleted successfully' });
  } catch (err) {
    console.error('Internal server error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}