if(fl)
  {

    Doctor.findById("60e83ba64a556a1d908703c3")
  .then((doc)=>{
    var ob={
              data: new Buffer(fl.deg.data,'base64'),
              contentType: fl.deg.name.split('.').pop()
           }
           doc.Certificates.push(ob);
           Doctor.updateOne({_id: objectId("60e83ba64a556a1d908703c3")},{$set:{Certificates:doc.Certificates}},
            function (err,result) {
            if (err){
                console.log(err)
            }else{
                console.log(result); 
                res.send("successfully");
            }
      })
    })
  }
  else
  {
    console.log("cannot") 
  }


  for(var i=0;i<dc.length;i++)
    {
        Patient.findById(dc[i].pat_id)
        .then((doc)=>{
          var ob={
            name:doc.name,
            date:dc.date,
            meet_url:dc.meet_url
          }
          obj.push(ob);
        })
    }