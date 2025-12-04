const ScanSchema = require('../models/scanresult');
const User = require('../models/user')
//const {validateurl1} = require('../utils/validator')
const runAccessibilityScan = require('../utils/runaccessibility')


const submiturl = async (req,res)=>{
    //validateurl1(req.body)
    const {url} = req.body;
    const userId = req.result._id;

    try{
        if (!url || !/^https?:\/\/.+$/.test(url)) {
            return res.status(400).json({ error: 'A valid URL is required.' });
        }
        const axeresult = await runAccessibilityScan(url);

        const issuesByImpact = { minor: 0, moderate: 0, serious: 0, critical: 0 };
        for (const violation of axeresult.violations) {
            if (violation.impact && issuesByImpact[violation.impact] !== undefined) {
            issuesByImpact[violation.impact]++;
        }
        
        }

        const scan1 = new ScanSchema({
            url,
            totalViolations: axeresult.violations.length,
            issuesByImpact,
            violations: axeresult.violations,
            userId: userId
        })

        await scan1.save();
        await User.findByIdAndUpdate(userId, {
            $addToSet: { scansall: scan1._id },
        });

        res.status(201).send("scan completed")
        //console.log(axeresult)

    }
    catch(err){
        console.error('❌ Scan error:', err);
        if (err.name === 'ValidationError') {
        return res.status(400).json({ error: err.message });
        }
        res.status(500).json({ error: 'Failed to scan the page. Please try again later.' });
    }
}

const allresult = async (req,res)=>{
    try{
        const allscans = await ScanSchema.find({}).select('_id url')
        if(allscans.length==0)
            return res.status(404).send("Scans is Missing");

        res.status(200).send(allscans)
    }
    catch(err){
        res.status(500).send("error for getting all scans" + err)
    }

}

const generateresult = async (req,res)=>{
  const {id} = req.params;
  try{
    if(!id)
       throw new Error('no user id found')

    const userresult = await ScanSchema.findById(id)
    if(!userresult)
      throw new Error("Scan id not valid"+ err)

    res.status(200).send(userresult);
  }
  catch(err){
    res.send("not able to get the problem" + err)
  }
}

const deleteresult = async (req,res)=>{
  const userId = req.result._id
  const {id} = req.params;
  try{
    if(!id)
      throw new Error("cannot delete user")

    const todelete = await ScanSchema.findByIdAndDelete(id);
    if(!todelete)
      throw new Error("user is already deleted")

    await User.findByIdAndUpdate(userId, {
       $pull: { scansall: id}
    });
    res.status(200).send("report deleted")
  }
  catch(err){
    res.send("error to delete" + err)
  }
}

const scansbyuser = async (req,res)=>{
  try{
    const userId = req.result._id;

    const user = await User.findById(userId).populate({
      path:"scansall",
      select:"_id url scandate violations"
    })

    res.status(200).send(user.scansall)

  }
  catch(err){
    res.send("error for getting all user scans" + err)
  }
}

//const userId = req.result._id;
module.exports = {submiturl,allresult,generateresult,deleteresult,scansbyuser}









/*


router.post('/', async (req, res) => {
  const { url, userId } = req.body;

  // Basic validation
  if (!url || !/^https?:\/\/.+$/.test(url)) {
    return res.status(400).json({ error: 'A valid URL is required.' });
  }

  try {
    const axeResults = await runAccessibilityScan(url);

    // Count issues by impact
    const issuesByImpact = { minor: 0, moderate: 0, serious: 0, critical: 0 };
    for (const violation of axeResults.violations) {
      if (violation.impact && issuesByImpact[violation.impact] !== undefined) {
        issuesByImpact[violation.impact]++;
      }
    }

    // Create and save scan result
    const scan = new ScanResult({
      url,
      totalViolations: axeResults.violations.length,
      issuesByImpact,
      violations: axeResults.violations,
      userId: userId || null,
    });

    await scan.save();

    // Send partial summary back (for dashboard use)
    res.status(201).json({
      message: '✅ Scan completed successfully.',
      scanId: scan._id,
      totalViolations: scan.totalViolations,
      issuesByImpact: scan.issuesByImpact,
      createdAt: scan.createdAt,
    });

  } catch (err) {
    console.error('❌ Scan error:', err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: 'Failed to scan the page. Please try again later.' });
  }
});

module.exports = router;


*/