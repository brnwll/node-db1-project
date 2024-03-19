const Account = require("./accounts-model");

exports.checkAccountPayload = (req, res, next) => {
  const { name, budget } = req.body;
  if (name === undefined || budget === undefined) {
    next({ status: 400, message: "name and budget are required" });
  } else if (
    typeof name !== "string" ||
    name.trim().length < 3 ||
    name.trim().length > 100
  ) {
    next({ status: 400, message: "name of account must be between 3 and 100" });
  } else if (typeof budget !== "number" || isNaN(budget)) {
    next({ status: 400, message: "budget of account must be a number" });
  } else if (budget < 0 || budget > 1000000) {
    next({
      status: 400,
      message: "budget of account is too large or too small",
    });
  } else {
    next();
  }
};

exports.checkAccountNameUnique = async (req, res, next) => {
  const { name } = req.body;
  const accounts = await Account.getAll();
  const nameTaken = accounts.find((account) => account.name === name);
  if (nameTaken) {
    next({ status: 400, message: "name is taken" });
  } else {
    next();
  }
};

exports.checkAccountId = async (req, res, next) => {
  try {
    const account = await Account.getById(req.params.id);
    if (account) {
      req.account = account;
      next();
    } else {
      next({ status: 404, message: "account not found" });
    }
  } catch (err) {
    next(err);
  }
};
