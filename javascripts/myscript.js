 var obj={
      username:req.body.username,
      DOB:req.body.DOB,
      name:req.body.name,
      email:req.body.email,
      mobile:req.body.mobile,
      Specialization:req.body.Special,
      Hospital_name:req.body.Hname,
      state:req.body.state,
      district:req.body.district,
      city:req.body.city,
      Id_proof:{
        data: new Buffer(req.files.Id_proof.data,'base64'),
        contentType: req.files.Id_proof.name.split('.').pop()
      },
      aadhar:req.body.aadhar,
      Degree_Certificate:{
        data: new Buffer(req.files.Degree_cer.data,'base64'),
        contentType: req.files.Degree_cer.name.split('.').pop()
      },
    }
    //res.send(obj);
     res.statusCode = 200;
        res.setHeader("Content-Type" , 'application/json');
DoctorQueue.create(obj)
.then((doc) => {
    //res.statusCode = 200;
    //res.setHeader("Content-Type" , 'application/json');
    res.json(obj);
}), (err) => next(err)
.catch((err) => next(err));