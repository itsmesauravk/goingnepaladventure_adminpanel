"use client"
import React, { useEffect, useState } from "react"
import { Button } from "../ui/button"
import {
  MapPin,
  Calendar,
  Users,
  Star,
  Mail,
  Phone,
  Globe,
  Landmark,
  DollarSign,
  User,
  Mountain,
  Utensils,
  Send,
  ArrowLeft,
} from "lucide-react"
import axios from "axios"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface TrekDetail {
  trekId: string
  trekName: string
  _id: string
}

interface PlanTripRequestProps {
  requestId: string
}

const ViewSinglePlanTripRequest: React.FC<PlanTripRequestProps> = ({
  requestId,
}) => {
  const [destination, setDestination] = useState<string>("")
  const [duration, setDuration] = useState<string>("")
  const [travelType, setTravelType] = useState<string>("")
  const [adult, setAdult] = useState<number>(0)
  const [children, setChildren] = useState<number>(0)
  const [preferedAccomodation, setPreferedAccomodation] = useState<string>("")
  const [mealType, setMealType] = useState<string>("")
  const [fullName, setFullName] = useState<string>("")
  const [email, setEmail] = useState<string>("")
  const [phoneNumber, setPhoneNumber] = useState<string>("")
  const [country, setCountry] = useState<string>("")
  const [address, setAddress] = useState<string>("")
  const [isTrek, setIsTrek] = useState<boolean>(false)
  const [trek, setTrek] = useState<TrekDetail[]>([])
  const [specialPlan, setSpecialPlan] = useState<string>("")
  const [estimatedBudget, setEstimatedBudget] = useState<number>(0)
  const [note, setNote] = useState<string>("")
  const [status, setStatus] = useState<string>("")
  const [createdAt, setCreatedAt] = useState<string>("")

  const [sendingMail, setSendingMail] = useState<boolean>(false)

  const router = useRouter()

  const handleSendEmail = async () => {
    toast.warning("Under development")
  }

  const getSinglePlanTripRequest = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL_DEV}/plan-trip/get-single-trip-request/${requestId}`
      )
      const data = response.data
      if (data.success) {
        const requestData = data.data
        setDestination(requestData.destination)
        setDuration(requestData.duration)
        setTravelType(requestData.travelType)
        setAdult(requestData.adult)
        setChildren(requestData.children)
        setPreferedAccomodation(requestData.preferedAccomodation)
        setMealType(requestData.mealType)
        setFullName(requestData.fullName)
        setEmail(requestData.email)
        setPhoneNumber(requestData.phoneNumber)
        setCountry(requestData.country)
        setAddress(requestData.address)
        setIsTrek(requestData.isTrek)
        setTrek(requestData.trek)
        setSpecialPlan(requestData.specialPlan)
        setEstimatedBudget(requestData.estimatedBudget)
        setNote(requestData.note)
        setStatus(requestData.status)
        setCreatedAt(requestData.createdAt)
      }
    } catch (error) {
      console.error(error)
      toast.error("Failed to load trip request details")
    }
  }

  useEffect(() => {
    getSinglePlanTripRequest()
  }, [requestId])

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="container mx-auto max-w-5xl">
        {/* Improved Header Section */}
        <div className="bg-white shadow-lg rounded-xl overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => router.back()}
                  className="hover:bg-blue-700/30 p-2 rounded-full transition-colors"
                >
                  <ArrowLeft size={28} />
                </button>
                <div>
                  <h1 className="text-3xl font-bold flex items-center gap-3">
                    <MapPin className="text-white" size={32} />
                    {destination} Trip Request
                  </h1>
                  <p className="text-blue-100 mt-1">
                    Submitted on {new Date(createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Button
                  onClick={handleSendEmail}
                  disabled={sendingMail}
                  className="bg-white text-blue-700 hover:bg-blue-50 flex items-center gap-2"
                >
                  {sendingMail ? "Sending..." : "Send Details"}
                  <Send size={18} />
                </Button>
                <span
                  className={`px-4 py-1.5 rounded-full text-sm font-semibold ${
                    status === "viewed"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {status}
                </span>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="p-8">
            {/* Trip Details Grid */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* Left Column */}
              <div>
                <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">
                  Trip Specifics
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Calendar className="text-blue-600" />
                    <span>
                      <strong>Duration:</strong> {duration}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <Users className="text-blue-600" />
                    <span>
                      <strong>Travel Type:</strong> {travelType}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <User className="text-blue-600" />
                    <span>
                      <strong>Travelers:</strong> {adult} Adults, {children}{" "}
                      Children
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <Star className="text-blue-600" />
                    <span>
                      <strong>Accommodation:</strong> {preferedAccomodation}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <Utensils className="text-blue-600" />
                    <span>
                      <strong>Meal Plan:</strong> {mealType}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div>
                <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">
                  Personal Information
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <User className="text-blue-600" />
                    <span>
                      <strong>Full Name:</strong> {fullName}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <Mail className="text-blue-600" />
                    <span>
                      <strong>Email:</strong> {email}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <Phone className="text-blue-600" />
                    <span>
                      <strong>Phone:</strong> {phoneNumber}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <Globe className="text-blue-600" />
                    <span>
                      <strong>Country:</strong> {country}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <Landmark className="text-blue-600" />
                    <span>
                      <strong>Address:</strong> {address}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Details */}
            <div className="mt-8 border-t pt-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">
                Additional Information
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  {isTrek && (
                    <div className="flex items-center gap-4">
                      <Mountain className="text-blue-600" />
                      <span>
                        <strong>Trek:</strong>{" "}
                        {trek.map((t) => t.trekName).join(", ")}
                      </span>
                    </div>
                  )}
                  {specialPlan && (
                    <div className="mt-2">
                      <strong>Special Plan:</strong> {specialPlan}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  <DollarSign className="text-blue-600" />
                  <span>
                    <strong>Estimated Budget:</strong> $
                    {estimatedBudget.toLocaleString()}
                  </span>
                </div>
              </div>

              {note && (
                <div className="mt-4 bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <strong className="text-blue-800">Additional Notes:</strong>
                  <p className="text-gray-700 mt-2">{note}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ViewSinglePlanTripRequest
