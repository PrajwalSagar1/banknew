const mongoose = require('mongoose');
const uri = "mongodb+srv://prajwalsagar02_db_user:Prajwal12121@cluster0.a9hlipy.mongodb.net/kodnestbank?appName=Cluster0";

async function test() {
    console.log("Connecting...");
    try {
        await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
        console.log("Connected successfully!");
        process.exit(0);
    } catch (e) {
        console.error("Connection failed:", e.message);
        process.exit(1);
    }
}
test();
