// App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import Videos from "./pages/UiElements/Videos";
import Images from "./pages/UiElements/Images";
import Alerts from "./pages/UiElements/Alerts";
// import Badges from "./pages/UiElements/Badges";
import Avatars from "./pages/UiElements/Avatars";
import Buttons from "./pages/UiElements/Buttons";
import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";
import Calendar from "./pages/Calendar";
import BasicTables from "./pages/Tables/BasicTables";
import FormElements from "./pages/Forms/FormElements";
import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";

import Home from "./pages/Dashboard/Home";

import TransactionHistoryTwo from "./pages/Transaction/TransactionHistory";
import MonthlyProfitShare from "./pages/Payout/Profit/MonthlyProfitShare";
import MonthlyProfitSetting from "./pages/MonthlyProfit/MonthlyProfitShare";
import DefaultReferralAssignment from "./pages/Referral/DefaultReferralAssignment";
import DirectReferralBonus from "./pages/ReferralBonus/DirectReferralBonus";
import LevelCommissions from "./pages/Commissions/LevelCommissions";
import ImageSettings from "./pages/ImageSettings/ImageSettings";
import PaymentGatewaySettings from "./pages/PaymentGateway/PaymentGatewaySettings";
import ActivityLog from "./pages/ActivityLog/ActivityLog";
import ProfileManagement from "./pages/ProfileManagement/ProfileManagement";
import Team from "./pages/Team/Team";
import ActivationFee from "./pages/ActivationFee/ActivationFee";
import TransactionFee from "./pages/AddWalletTransactionFee/TransferTransactionFee";
import WithdrawalCharge from "./pages/WithdrawalCharge/WithdrawalCharge";
import ProtectedRoute from "./components/protect/ProtectedRoute";
import ManageUsers from "./pages/Users/Manageusers";
import AddWalletRequest from "./pages/Payout/PaymentRequest/AddWalletRequest";
import TransferTranscationFee from "./pages/AddWalletTransactionFee/TransferTransactionFee";
import TransferWallet from "./pages/Payout/PaymentRequest/TransferWallet";
import WithdrawalRequest from "./pages/Payout/PaymentRequest/WithdrawlRequest";

export default function App() {
  return (
    <>
      <Router>
        <Routes>
          {/* Auth Layout - Public Routes */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Protected Routes - Dashboard Layout */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            {/* Remove the leading slash from all nested routes */}
            <Route index element={<Home />} />
            <Route path="transferWalletRequest" element={<TransferWallet />} />
            <Route path="withdrawlRequest" element={<WithdrawalRequest />} />
            <Route path="addWalletRequest" element={<AddWalletRequest />} />
            <Route path="mpshare" element={<MonthlyProfitShare />} />
            <Route
              path="transactionHistory"
              element={<TransactionHistoryTwo />}
            />
            <Route
              path="monthlyProfitSettings"
              element={<MonthlyProfitSetting />}
            />
            <Route
              path="defaultReferral"
              element={<DefaultReferralAssignment />}
            />
            <Route path="referralBonus" element={<DirectReferralBonus />} />
            <Route path="15LevelCommission" element={<LevelCommissions />} />
            <Route path="accountActivationFee" element={<ActivationFee />} />
            <Route
              path="add-wallet-transaction-fee"
              element={<TransactionFee />}
            />
            <Route
              path="transfer-wallet-transaction-fee"
              element={<TransferTranscationFee />}
            />
            <Route path="imageSettings" element={<ImageSettings />} />
            <Route
              path="paymentGatewaySettings"
              element={<PaymentGatewaySettings />}
            />
            <Route path="activityLogs" element={<ActivityLog />} />
            <Route path="withdrawalCharge" element={<WithdrawalCharge />} />
            <Route path="profileManagement" element={<ProfileManagement />} />
            <Route path="team" element={<Team />} />
            <Route path="profile" element={<UserProfiles />} />
            <Route path="calendar" element={<Calendar />} />
            <Route path="blank" element={<Blank />} />

            {/* Forms */}
            <Route path="form-elements" element={<FormElements />} />

            {/* Tables */}
            <Route path="basic-tables" element={<BasicTables />} />

            {/* Ui Elements */}
            {/* <Route path="alerts" element={<Alerts />} />
            <Route path="avatars" element={<Avatars />} />
            <Route path="badge" element={<Badges />} />
            <Route path="buttons" element={<Buttons />} />
            <Route path="images" element={<Images />} />
            <Route path="videos" element={<Videos />} /> */}
            <Route path="manage-users" element={<ManageUsers />} />

            {/* Charts */}
            <Route path="line-chart" element={<LineChart />} />
            <Route path="bar-chart" element={<BarChart />} />
          </Route>

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}
