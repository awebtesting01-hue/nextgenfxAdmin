import { useState, useRef, useEffect } from "react";
import { BiWallet, BiLock, BiShow, BiHide } from "react-icons/bi";
import { IoMdSettings } from "react-icons/io";
import { walletApi, WalletSetting } from "../../apis/walletSettingsApi";

interface GatewayField {
  label: string;
  type: string;
  placeholder: string;
  sensitive?: boolean;
}

interface Gateway {
  id: string;
  label: string;
  enabled: boolean;
  fields: GatewayField[];
  liveValues: Record<string, string>;
  testValues: Record<string, string>;
}

export default function PaymentGatewaySettings() {
  const [gateways, setGateways] = useState<Gateway[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const passwordRefs = useRef<Record<string, Record<string, boolean>>>({});

  useEffect(() => {
    fetchWallets();
  }, []);

  const fetchWallets = async () => {
    try {
      setLoading(true);
      const res = await walletApi.getAll();

      if (res.success && res.data.length > 0) {
        // map DB wallets into your Gateway format
        const mapped: Gateway[] = res.data.map((wallet: WalletSetting) => ({
          id: wallet._id,
          label: `${wallet.network} Wallet`,
          enabled: true,
          fields: [
            {
              label: "Node URL",
              type: "text",
              placeholder: "https://bsc-dataseed.binance.org/",
            },
            {
              label: "Wallet Address",
              type: "text",
              placeholder: "Your Wallet Address",
            },
            { label: "Token Decimals", type: "number", placeholder: "18" },
          ],
          liveValues: {
            "Node URL": wallet.nodeUrl || "",
            "Wallet Address": wallet.address || "",
            "Token Decimals": wallet.tokenDecimals
              ? wallet.tokenDecimals.toString()
              : "18", // ✅ fallback
          },
          testValues: {}, // extend if you add test settings later
        }));

        setGateways(mapped);
      } else {
        // fallback default if nothing in DB
        setGateways([
          {
            id: "BEP20",
            label: "BEP20 Settings",
            enabled: true,

            liveValues: {},
            testValues: {},
            fields: [
              {
                label: "Node URL",
                type: "text",
                placeholder: "https://bsc-dataseed.binance.org/",
              },
              {
                label: "Wallet Address",
                type: "text",
                placeholder: "Your BEP20 Wallet Address",
              },
              { label: "Token Decimals", type: "number", placeholder: "18" },
            ],
          },
        ]);
      }
    } catch (error) {
      console.error("Failed to fetch wallets:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleAccordion = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleFieldChange = (id: string, fieldLabel: string, value: string) => {
    setGateways(
      gateways.map((gateway) => {
        if (gateway.id === id) {
          const newValues = { ...gateway.liveValues, [fieldLabel]: value };

          return { ...gateway, liveValues: newValues };
        }
        return gateway;
      })
    );
  };

  const togglePasswordVisibility = (id: string, fieldLabel: string) => {
    if (!passwordRefs.current[id]) {
      passwordRefs.current[id] = {};
    }
    passwordRefs.current[id][fieldLabel] =
      !passwordRefs.current[id][fieldLabel];
    setGateways([...gateways]);
  };

  const saveSettings = async () => {
    try {
      for (const gateway of gateways) {
        const payload = {
          name: gateway.label,
          address: gateway.liveValues["Wallet Address"] || "",
          network: gateway.label.split(" ")[0], // e.g. BEP20
          nodeUrl: gateway.liveValues["Node URL"] || "",
          tokenDecimals: Number(gateway.liveValues["Token Decimals"]) || 18,
          description: "Configured via frontend",
        };

        if (gateway.id.startsWith("BEP20") || gateway.id.length < 24) {
          // new (not in DB yet)
          await walletApi.create(payload);
        } else {
          // existing -> update
          await walletApi.update(gateway.id, payload);
        }
      }
      setShowSuccess(true);
      fetchWallets(); // refresh
    } catch (error) {
      console.error("Failed to save:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
          <BiWallet className="mr-2" />
          Wallet & Payment Gateway Settings
        </h2>

        {showSuccess && (
          <div className="mb-6 p-4 bg-green-100 text-green-800 rounded-lg">
            Settings saved successfully!
          </div>
        )}

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="space-y-4">
            {gateways.map((gateway) => (
              <div
                key={gateway.id}
                className={`bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm transition-all ${
                  expandedId === gateway.id
                    ? "ring-2 ring-blue-500"
                    : "hover:shadow-md"
                }`}
              >
                <div
                  className="flex justify-between items-center p-4 cursor-pointer hover:bg-blue-50"
                  onClick={() => toggleAccordion(gateway.id)}
                >
                  <div className="flex items-center">
                    <IoMdSettings className="text-gray-500 mr-2" />
                    <h3 className="font-medium text-gray-800">
                      {gateway.label}
                    </h3>
                  </div>
                  <svg
                    className={`w-5 h-5 text-gray-500 transition-transform ${
                      expandedId === gateway.id ? "transform rotate-180" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>

                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    expandedId === gateway.id
                      ? "max-h-[2000px] opacity-100 p-4 border-t"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {gateway.fields.map((field) => (
                      <div
                        key={`${gateway.id}-${field.label}`}
                        className="space-y-1"
                      >
                        <label className="flex items-center text-sm font-medium text-gray-700">
                          {field.sensitive && (
                            <BiLock className="mr-1 text-gray-500" />
                          )}
                          {field.label}
                        </label>
                        <div className="relative">
                          <input
                            type={
                              passwordRefs.current[gateway.id]?.[field.label]
                                ? "text"
                                : field.type
                            }
                            value={gateway.liveValues[field.label]}
                            onChange={(e) =>
                              handleFieldChange(
                                gateway.id,
                                field.label,
                                e.target.value
                              )
                            }
                            placeholder={`${field.placeholder}`}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                          />
                          {field.type === "password" && (
                            <button
                              type="button"
                              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
                              onClick={() =>
                                togglePasswordVisibility(
                                  gateway.id,
                                  field.label
                                )
                              }
                            >
                              {passwordRefs.current[gateway.id]?.[
                                field.label
                              ] ? (
                                <BiHide />
                              ) : (
                                <BiShow />
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-end mt-6">
          <button
            onClick={saveSettings}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}
