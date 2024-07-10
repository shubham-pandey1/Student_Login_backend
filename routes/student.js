const express = require('express');
const router = express.Router();
const fetchuser = require('../middleware/fetchuser');
const Studentdata = require('../model/Studentdata');
const{body,validationResult} = require('express-validator');

//Route 1: fetching details of all student
router.get('/fetchallstudent', fetchuser, async(req, res)=>{
    const details = await Studentdata.find();
    res.json(details);
})

// Route 2: Adding student detail
router.post('/addstudent', fetchuser, [
    body('Name', 'Enter a valid name').isLength({min: 3}),
    body('Email', 'Email must be atleast 3').isLength({min:3}),
    body('Phone', 'Phone must be atleast 10').isLength({min:10}),
    body('EnrollNo', 'Enroll No must be atleast 10').isLength({min:10}),
    body('DOA', 'DOA must be atleast 6').isLength({min:3}) 
], async(req,res)=>{
    try{
        const{Name, Email, Phone, EnrollNo, DOA}= req.body;

        // If there are errors, return Bad request and the errors
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()});
        }

        const student = new Studentdata({
            Name, Email, Phone, EnrollNo, DOA
        })

        const saveDet = await student.save();
        res.json(saveDet);
    } catch(error){
        console.error(error.message);
        res.status(500).send("Internal server error");
    }
})

router.delete('/deletestudent/:id', fetchuser, async(req, res)=>{
    try{
    let details = await Studentdata.findById(req.params.id);
    if(!details){return res.status(404).send("Not Found")}

    details = await Studentdata.findByIdAndDelete(req.params.id);
    res.json({"Success": "Detail has been deleted", details: details});
    }
    catch(error){
        console.error(error.message);
        res.status(500).send("Internal server error");
    }
})

router.put('/updatedetail/:id', fetchuser, async (req, res) => {
    const { Name, Email, Phone, EnrollNo, DOA } = req.body;

    // Create a new detail object with only the defined fields
    const newDetails = {};
    if (Name) { newDetails.Name = Name; }
    if (Email) { newDetails.Email = Email; }
    if (Phone) { newDetails.Phone = Phone; }
    if (EnrollNo) { newDetails.EnrollNo = EnrollNo; }
    if (DOA) { newDetails.DOA = DOA; }

    try {
        // Find note to be updated and update it
        const updatedDetail = await Studentdata.findByIdAndUpdate(
            req.params.id,
            { $set: newDetails },
            { new: true } // Return the updated document
        );

        if (!updatedDetail) {
            return res.status(404).send("Not Found");
        }

        res.status(200).json(updatedDetail); // Respond with the updated detail
        
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error: " + error.message); // Better error handling
    }
});


module.exports = router