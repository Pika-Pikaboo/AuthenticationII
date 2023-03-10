const mongoose = require("mongoose"),
  Subscriber = require("../models/subscribers"),
  getSubscriberParams = (body) => {
    return {
      name: body.name,
      email: body.email,
      zipCode: parseInt(body.zipCode),
    };
  };

module.exports = {
  index: (req, res, next) => {
    Subscriber.find({})
      .then((subscribers) => {
        res.locals.subscribers = subscribers;
        next();
      })
      .catch((error) => {
        console.log(`Error fetching subscribers: ${error.message}`);
        next(error);
      });
  },

  indexView: (req, res) => {
    res.render("subscribers/index", {
      flashMessages: {
        success: "Loaded all users!",
      },
    });
  },

  new: (req, res) => {
    res.render("subscribers/new");
  },

  create: (req, res, next) => {
    let subscriberParams = getSubscriberParams(req.body);
    Subscriber.create(subscriberParams)
      .then((subscriber) => {
        req.flash(
          "success",
          `${subscriber.name}'s account created successfully!`
        );
        res.locals.subscriber = subscriber;
        res.locals.redirect = "/subscribers";
        next();
      })
      .catch((error) => {
        console.log(`Error saving new subscriber: ${error.message}`);
        res.locals.redirect = "/subscribers/new";
        req.flash(
          "error",
          `Failed to create subscriber account because: ${error.message}`
        );
        next();
      });
  },

  redirectView: (req, res, next) => {
    let redirectPath = res.locals.redirect;
    if (redirectPath) {
      res.redirect(redirectPath);
    } else {
      next();
    }
  },

  show: (req, res, next) => {
    let subscriberId = req.params.id;
    Subscriber.findById(subscriberId)
      .then((subscriber) => {
        res.locals.subscriber = subscriber;
        next();
      })
      .catch((error) => {
        console.log(`Error fetching subscriber by ID: ${error.message}`);
        next(error);
      });
  },

  showView: (req, res) => {
    res.render("subscribers/show");
  },

  edit: (req, res, next) => {
    let subscriberId = req.params.id;
    Subscriber.findById(subscriberId)
      .then((subscriber) => {
        res.render("subscribers/edit", {
          subscriber: subscriber,
        });
      })
      .catch((error) => {
        console.log(`Error fetching subscriber by ID: ${error.message}`);
        next(error);
      });
  },

  update: (req, res, next) => {
    let subscriberId = req.params.id,
      subscriberParams = getSubscriberParams(req.body);

    Subscriber.findByIdAndUpdate(subscriberId, {
      $set: subscriberParams,
    })
      .then((subscriber) => {
        res.locals.redirect = `/subscribers/${subscriberId}`;
        res.locals.subscriber = subscriber;
        next();
      })
      .catch((error) => {
        console.log(`Error updating subscriber by ID: ${error.message}`);
        next(error);
      });
  },

  delete: (req, res, next) => {
    let subscriberId = req.params.id;
    Subscriber.findByIdAndRemove(subscriberId)
      .then(() => {
        res.locals.redirect = "/subscribers";
        next();
      })
      .catch((error) => {
        console.log(`Error deleting a subscriber by ID: ${error.message}`);
        next(error);
      });
  },
};
