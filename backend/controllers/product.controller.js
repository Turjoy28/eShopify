import Product from "../models/product.model.js"
import cloudinary from "../lib/cloudinary.js"
const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find({})
        res.json({ products })
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message })
    }
}

const getFeaturedProducts = async (req, res) => {
    try {
        let featuredProducts = await redis.get("featured_products")
        if (featuredProducts) {
            return res.json(JSON.parse(featuredProducts));
        }
        //if not in redis,fetch from mongodb
        /* .lean() is gonna return a plain javascript object instead of a mongodb document
            which is good for performance!!!*/
        featuredProducts = await Product.find({ isFeatured: true }).lean();
        if (!featuredProducts) {
            return res.status(404).json({ message: "No featured product found" })

        }
        await redis.set("featured_products", JSON.stringify(featuredProducts));
        res.json(featuredProducts);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

const createProduct = async (req, res) => {
    try {
        const { name, description, price, image, catagory } = req.body;
        let cloudinaryResponse = null;
        if (image) {
            cloudinaryResponse = await cloudinary.uploader.upload(image, { folder: "products" })
        }
        const product = await product.create({
            name,
            description,
            price,
            image: cloudinary?.secure_url ? cloudinaryResponse.secure_url : "",
            catagory,
        })
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}


const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Products not found" })
        }
        if (product.image) {
            const publicId = product.image.split("/").pop().split(".")[0];
            try {
                await cloudinary.uploader.destroy(`products/${publicId}`);
                console.log("deleted image from cloudinary")
            } catch (error) {
                console.log("deleted image from cloudinary");
            }
        }
        await Product.findOneAndDelete(req.params.id);
        res.json({ message: "product deleted successfully" })
    } catch (error) {
        console.log("Error in deleteProduct controller", error.message);
        res.status(500).json({ message: "Server error", error: error.message })
    }
}

const getRecommendations = async (req, res) => {
    try {
        const products = await Product.aggregate([
            {
                $sample: { size: 3 }
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    description: 1,
                    image: 1,
                    price: 1
                }
            }
        ])
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message })
    }
}
const getProductsCatagory = async (req, res) => {
    const { catagory } = req.params;
    try {

        const products = await Product.find({ catagory });
        res.json(products);

    } catch (error) {
        console.log("Error in getProductCatagory controller", error.message);
        res.status(500).json({ message: "Server error", error: error.message })
    }
}

const toggleFeaturedProduct= async(req,res)=>{
    try{
        const product=await Product.findById(req.params.id);
        if(product){
            product.isFeatured=!product.isFeatured;
            const updatedProduct= await product.save();
            await updateFeaturedPrductCached();
            res.json(updatedProduct);
        }else{
          res.status(404).json({message:"Product not found"})  
        }
    }catch(error){
        console.log("Error in toggleFeaturedProduct controller", error.message);
        res.status(500).json({ message: "Server error", error: error.message })
    }
}


async function updateFeaturedPrductCached(){
    try{
        const featuredProducts= await Product.find({isFeatured:true}).lean();
        await redis.set("featured_products",JSON.stringify(featuredProducts));
    }catch(error){
        console.log("error in update cache function")
    }
}





export default {
    getAllProducts,
    getFeaturedProducts,
    createProduct,
    deleteProduct,
    getRecommendations,
    getProductsCatagory,
    toggleFeaturedProduct
}