const express = require("express");
const router = new express.Router();
const userdb = require("../models/userSchema");
const customerdb = require("../models/customerSchema");
var bcrypt = require("bcryptjs");
const authenticate = require("../middleware/authenticate");
const transactiondb = require("../models/transactionSchema");
const supplierdb = require("../models/supplierSchema");
const supplierEnteriesdb = require("../models/supplierEnteriesSchema");
// for user registration

router.post("/register", async (req, res) => {
  const { fname, email, password, cpassword } = req.body;

  if (!fname || !email || !password || !cpassword) {
    res.status(422).json({ error: "fill all the details" });
  }

  try {
    const preuser = await userdb.findOne({ email: email });

    if (preuser) {
      res.status(422).json({ error: "This Email is Already Exist" });
    } else if (password !== cpassword) {
      res
        .status(422)
        .json({ error: "Password and Confirm Password Not Match" });
    } else {
      const finalUser = new userdb({
        fname,
        email,
        password,
        cpassword,
      });

      // here password hasing

      const storeData = await finalUser.save();

      // console.log(storeData);
      res.status(201).json({ status: 201, storeData });
    }
  } catch (error) {
    res.status(422).json(error);
    console.log("catch block error");
  }
});

// user Login

router.post("/login", async (req, res) => {
  // console.log(req.body);

  const { email, password } = req.body;

  if (!email || !password) {
    res.status(422).json({ error: "fill all the details" });
  }

  try {
    const userValid = await userdb.findOne({ email: email });

    if (userValid) {
      const isMatch = await bcrypt.compare(password, userValid.password);

      if (!isMatch) {
        res.status(422).json({ error: "invalid details" });
      } else {
        // token generate
        const token = await userValid.generateAuthtoken();

        // cookiegenerate
        res.cookie("usercookie", token, {
          expires: new Date(Date.now() + 9000000),
          httpOnly: true,
        });

        const result = {
          userValid,
          token,
        };
        res.status(201).json({ status: 201, result });
      }
    }
  } catch (error) {
    res.status(401).json(error);
    console.log("catch block");
  }
});

// user valid
router.get("/validuser", authenticate, async (req, res) => {
  try {
    const ValidUserOne = await userdb.findOne({ _id: req.userId });
    res.status(201).json({ status: 201, ValidUserOne });
  } catch (error) {
    res.status(401).json({ status: 401, error });
  }
});

// user logout

router.get("/logout", authenticate, async (req, res) => {
  try {
    req.rootUser.tokens = req.rootUser.tokens.filter((curelem) => {
      return curelem.token !== req.token;
    });

    res.clearCookie("usercookie", { path: "/" });

    req.rootUser.save();

    res.status(201).json({ status: 201 });
  } catch (error) {
    res.status(401).json({ status: 401, error });
  }
});

//Customer database
//add customers
router.post("/addCustomers", async (req, res) => {
  try {
    const { customerName, id } = req.body;
    const existingUser = await userdb.findById(id);

    if (existingUser) {
      const customer = new customerdb({ customerName, user: existingUser });
      existingUser.customers.push(customer);

      // Save both customer and existingUser
      await Promise.all([customer.save(), existingUser.save()]);

      res.status(200).json({ customer });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//delete customer

router.delete("/deleteCustomer/:id", async (req, res) => {
  try {
    const { id } = req.body;
    const existingUser = await userdb.findOneAndUpdate(id, {
      $pull: { customers: req.params.id },
    });
    if (existingUser) {
      await customerdb
        .findByIdAndDelete(req.params.id)
        .then(() => res.status(200).json({ message: "customer deleted" }));
    }
  } catch (error) {
    console.log(error);
  }
});

//get customers
router.get("/getCustomers/:id", async (req, res) => {
  const customers = await customerdb.find({ user: req.params.id });
  res.status(200).json({ customers: customers });
});

//transactions (customer enteries)
router.post("/addTransactions", async (req, res) => {
  try {
    const { customerId, Date, YouGot, YouGave } = req.body;
    //   const existingCustomer = await userdb.findOne({ customerId });
    const existingCustomer = await customerdb.findById(customerId);
    if (existingCustomer) {
      const transaction = new transactiondb({
        Date,
        YouGot,
        YouGave,
        customer: existingCustomer,
      });
      await transaction
        .save()
        .then(() => res.status(200).json({ transaction }));
      existingCustomer.transactions.push(transaction);
      await existingCustomer.save();
    }
  } catch (error) {
    console.log(error);
  }
});

//delete transactions

router.delete("/deleteTransaction/:id", async (req, res) => {
  try {
    const { id } = req.body;
    const existingCustomer = await customerdb.findOneAndUpdate(
       id ,
      { $pull: { transactions: req.params.id } }
    );
    if (existingCustomer) {
       await transactiondb
        .findByIdAndDelete(req.params.id)
        .then(() => res.status(200).json({ message: "Transaction deleted" }));
    }
  } catch (error) {
    console.log(error);
  }
});

//get transactions
router.get("/getTransactions/:id", async (req, res) => {
  const transactions = await transactiondb.find({ customer: req.params.id });
  res.status(200).json({ transactions: transactions });
});

//add suppliers
router.post("/addSuppliers", async (req, res) => {
  try {
    const { supplierName, phone, email } = req.body;
    const existingUser = await userdb.findOne({ email });
    if (existingUser) {
      const supplier = new supplierdb({
        supplierName,
        phone,
        user: existingUser,
      });
      await supplier.save().then(() => res.status(200).json({ supplier }));
      existingUser.suppliers.push(supplier);
      await existingUser.save();
    }
  } catch (error) {
    console.log(error);
  }
});

//delete supplier

router.delete("/deleteSupplier/:id", async (req, res) => {
  try {
    const { email } = req.body;
    const existingUser = await userdb.findOneAndUpdate(
      { email },
      { $pull: { suppliers: req.params.id } }
    );
    if (existingUser) {
      const supplier = await supplierdb
        .findByIdAndDelete(req.params.id)
        .then(() => res.status(200).json({ message: "supplier deleted" }));
    }
  } catch (error) {
    console.log(error);
  }
});

//get Supplier
router.get("/getSuppliers/:id", async (req, res) => {
  const suppliers = await supplierdb.find({ user: req.params.id });
  res.status(200).json({ suppliers: suppliers });
});
//add Supplier Enteries
router.post("/addSupplierEnteries", async (req, res) => {
  try {
    const { supplierId, Date, Item, Unit } = req.body;
    //   const existingCustomer = await userdb.findOne({ supplierId });
    const existingSupplier = await supplierdb.findById(supplierId);
    if (existingSupplier) {
      const supplierEntry = new supplierEnteriesdb({
        Date,
        Item,
        Unit,
        supplier: existingSupplier,
      });
      await supplierEntry
        .save()
        .then(() => res.status(200).json({ supplierEntry }));
      existingSupplier.enteries.push(supplierEntry);
      await existingSupplier.save();
    }
  } catch (error) {
    console.log(error);
  }
});

//delete supplierEnteries

router.delete("/deleteSupplierEntry/:id", async (req, res) => {
  try {
    const { supplierId } = req.body;
    const existingSupplier = await supplierdb.findOneAndUpdate(
      { supplierId },
      { $pull: { enteries: req.params.id } }
    );
    if (existingSupplier) {
      const entry = await supplierEnteriesdb
        .findByIdAndDelete(req.params.id)
        .then(() =>
          res.status(200).json({ message: "Supplier Entry deleted" })
        );
    }
  } catch (error) {
    console.log(error);
  }
});

//get Supplier Enteries
router.get("/getSupplierEnteries/:id", async (req, res) => {
  const enteries = await supplierEnteriesdb.find({ supplier: req.params.id });
  res.status(200).json({ enteries: enteries });
});
module.exports = router;

// 2 way connection
// 12345 ---> e#@$hagsjd
// e#@$hagsjd -->  12345

// hashing compare
// 1 way connection
// 1234 ->> e#@$hagsjd
// 1234->> (e#@$hagsjd,e#@$hagsjd)=> true
