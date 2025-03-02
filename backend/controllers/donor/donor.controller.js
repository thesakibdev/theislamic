const Donor = require("../../models/donor.model");
const cloudinary = require("../../lib/cloudinary");
const { invalidateCache, setCache, getCache } = require("../../utils/utils");

const handleImageUpload = async (req, res) => {
  try {
    const fileBuffer = req.file.buffer;
    const public_id = `image_${Date.now()}`;
    const folder = "Donor_images";

    const { optimizedUrl, public_id: uploadedPublicId } =
      await cloudinary.imageUploadUtil(fileBuffer, public_id, folder);

    res.json({
      success: true,
      data: { optimizedUrl, public_id: uploadedPublicId },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Image upload failed" });
  }
};

const createDonor = async (req, res) => {
  try {
    const {
      name,
      fatherName,
      email,
      phone,
      dateOfBirth,
      typeOfDonation,
      companyName,
      profession,
      designation,
      country,
      street,
      city,
      avatar,
      avatarId,
      amount,
      isDetailsVisible,
      donateDate,
    } = req.body;

    if (!phone) {
      return res.status(400).json({
        error: true,
        message: "Phone number is required.",
      });
    }

    const donorDoc = await Donor.findOne({ phone, name, fatherName });

    if (donorDoc) {
      donorDoc.TotalDonation += amount;
      donorDoc.donationHistory.push({ amount, donateDate });
      await donorDoc.save();

      invalidateCache("donors");

      return res.status(200).json({
        success: true,
        message: "Donor updated successfully.",
        data: donorDoc,
      });
    }

    const newDonor = new Donor({
      name,
      fatherName,
      email,
      phone,
      dateOfBirth,
      typeOfDonation,
      companyName,
      designation,
      profession,
      country,
      street,
      city,
      avatar,
      avatarId,
      TotalDonation: amount,
      isDetailsVisible,
      donateDate,
      donationHistory: [{ amount, donateDate, history: [] }],
    });

    const savedDonor = await newDonor.save();
    invalidateCache("donors");

    return res.status(201).json({
      success: true,
      message: "Donor created successfully.",
      data: savedDonor,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: true, message: "Server error." });
  }
};

const editDonor = async (req, res) => {
  try {
    const id = req.params.id;
    const {
      avatar,
      avatarId,
      name,
      fatherName,
      email,
      phone,
      dateOfBirth,
      typeOfDonation,
      companyName,
      designation,
      profession,
      country,
      street,
      city,
      amount,
      isDetailsVisible,
      donateDate,
    } = req.body;

    const findDonor = await Donor.findById(id);

    findDonor.TotalDonation += amount || 0;
    findDonor.isDetailsVisible = isDetailsVisible || findDonor.isDetailsVisible;
    findDonor.name = name || findDonor.name;
    findDonor.fatherName = fatherName || findDonor.fatherName;
    findDonor.email = email || findDonor.email;
    findDonor.phone = phone || findDonor.phone;
    findDonor.dateOfBirth = dateOfBirth || findDonor.dateOfBirth;
    findDonor.typeOfDonation = typeOfDonation || findDonor.typeOfDonation;
    findDonor.companyName = companyName || findDonor.companyName;
    findDonor.designation = designation || findDonor.designation;
    findDonor.profession = profession || findDonor.profession;
    findDonor.country = country || findDonor.country;
    findDonor.street = street || findDonor.street;
    findDonor.city = city || findDonor.city;
    findDonor.avatar = avatar || findDonor.avatar;
    findDonor.avatarId = avatarId || findDonor.avatarId;
    findDonor.donateDate = donateDate || findDonor.donateDate;

    if (amount) {
      findDonor.donationHistory.push({ amount, donateDate, history: [] });
    }

    await findDonor.save();

    invalidateCache("donors");

    return res.status(200).json({
      success: true,
      message: "Donor updated successfully.",
      data: findDonor,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: true, message: "Server error." });
  }
};

const deleteDonor = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    const deletedDonor = await Donor.findByIdAndDelete(id);
    invalidateCache("donors");
    return res.status(200).json({
      success: true,
      message: "Donor deleted successfully.",
      data: deletedDonor,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: true, message: "Server error." });
  }
};

const getAllDonors = async (req, res) => {
  try {
    const { page, limit } = req.query;
    const currentPage = parseInt(page, 10) || 1;
    const pageLimit = parseInt(limit, 10) || 10;

    const cacheKey = `donorsPage_${currentPage}_limit_${pageLimit}`;
    const cachedDonors = getCache(cacheKey);

    if (cachedDonors) {
      return res.status(200).json(cachedDonors);
    }

    const totalDonors = await Donor.countDocuments();

    const donors = await Donor.find({})
      .sort({ TotalDonation: -1 })
      .skip((currentPage - 1) * pageLimit)
      .limit(pageLimit)
      .lean();

    const donorsWithTotalDonation = donors.map((donor) => {
      const totalDonation = (donor.donationHistory || []).reduce(
        (acc, curr) => acc + (curr.amount || 0),
        0
      );
      return { ...donor, totalDonation };
    });

    setCache(cacheKey, { donors: donorsWithTotalDonation, totalDonors }, 600);

    res.status(200).json({
      success: true,
      currentPage,
      totalPages: Math.ceil(totalDonors / pageLimit),
      totalDonors,
      donors: donorsWithTotalDonation,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: true, message: "Server error." });
  }
};

module.exports = {
  createDonor,
  handleImageUpload,
  getAllDonors,
  editDonor,
  deleteDonor,
};
