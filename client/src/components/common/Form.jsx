import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";

export default function CommonForm({
  layout,
  formControls,
  formData,
  setFormData,
  onSubmit,
  buttonText,
  isBtnDisabled,
  isLoading,
  allClasses = {
    formClass: "",
    btnClass: "",
    labelClass: "",
    inputClass: "",
    selectClass: "",
    textareaClass: "",
  },
}) {
  function renderInputsByComponentType(getControlItem) {
    let element = null;
    const value = formData[getControlItem.name] || "";

    switch (getControlItem.componentType) {
      case "input":
        element = (
          <Input
            name={getControlItem.name}
            className={allClasses.inputClass}
            placeholder={getControlItem.placeholder}
            id={getControlItem.name}
            type={getControlItem.type}
            value={value}
            {...(getControlItem.isMultiple ? { multiple: true } : {})}
            onChange={(event) =>
              setFormData({
                ...formData,
                [getControlItem.name]: event.target.value,
              })
            }
          />
        );

        break;
      case "select":
        element = (
          <Select
            onValueChange={(value) =>
              setFormData({
                ...formData,
                [getControlItem.name]: value,
              })
            }
            value={value}
            className={allClasses.selectClass}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={getControlItem.label} />
            </SelectTrigger>
            <SelectContent>
              {getControlItem.options && getControlItem.options.length > 0
                ? getControlItem.options.map((optionItem) => (
                    <SelectItem
                      className="capitalize"
                      key={optionItem.id}
                      value={optionItem.id}
                    >
                      {optionItem.label}
                    </SelectItem>
                  ))
                : null}
            </SelectContent>
          </Select>
        );

        break;
      case "textarea":
        element = (
          <Textarea
            name={getControlItem.name}
            className={allClasses.textareaClass}
            placeholder={getControlItem.placeholder}
            id={getControlItem.id}
            value={value}
            onChange={(event) =>
              setFormData({
                ...formData,
                [getControlItem.name]: event.target.value,
              })
            }
          />
        );

        break;
      case "multiInput":
        element = (
          <div className="flex flex-col gap-2">
            <Input
              name={getControlItem.name}
              className={allClasses.inputClass}
              placeholder={getControlItem.placeholder}
              id={getControlItem.name}
              type={getControlItem.type}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  const newValue = event.target.value.trim();
                  if (newValue) {
                    setFormData({
                      ...formData,
                      [getControlItem.name]: [
                        ...(formData[getControlItem.name] || []),
                        newValue,
                      ],
                    });
                    event.target.value = "";
                  }
                }
              }}
            />
            <div className="flex flex-wrap gap-2">
              {(formData[getControlItem.name] || []).map((item, index) => (
                <span
                  key={index}
                  className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded-md"
                >
                  {item}
                  <button
                    type="button"
                    className="text-slate-400 hover:text-slate-600"
                    onClick={() => {
                      setFormData({
                        ...formData,
                        [getControlItem.name]: formData[
                          getControlItem.name
                        ].filter((_, i) => i !== index),
                      });
                    }}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        );
        break;

      case "multiObjectTextarea":
        element = (
          <div className="flex flex-col gap-2">
            {getControlItem.fields.map((field, index) => (
              <div key={field} className="flex flex-col gap-1">
                <Label className={allClasses.labelClass}>
                  {`${getControlItem.label} (${field})`}
                </Label>
                <Textarea
                  name={`${getControlItem.name}-${field}`}
                  className={allClasses.textareaClass}
                  placeholder={`${getControlItem.label} (${field})`}
                  value={formData[getControlItem.name]?.[index]?.[field] || ""}
                  onChange={(event) => {
                    const updatedTranslations = [
                      ...(formData[getControlItem.name] || []),
                    ];

                    // Update or initialize the object for the specific field
                    updatedTranslations[index] = {
                      ...updatedTranslations[index],
                      [field]: event.target.value,
                    };

                    setFormData({
                      ...formData,
                      [getControlItem.name]: updatedTranslations,
                    });
                  }}
                />
              </div>
            ))}
          </div>
        );
        break;

      default:
        element = (
          <Input
            name={getControlItem.name}
            className={allClasses.inputClass}
            placeholder={getControlItem.placeholder}
            id={getControlItem.name}
            type={getControlItem.type}
            value={value}
            onChange={(event) =>
              setFormData({
                ...formData,
                [getControlItem.name]: event.target.value,
              })
            }
          />
        );
        break;
    }

    return element;
  }

  return (
    <form onSubmit={onSubmit}>
      {layout === 2 ? (
        // Layout 2 Design
        <div className="space-y-8 py-10">
          {/* Meta Data Section */}
          <div className="p-6 bg-primary-foreground rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Meta Data</h2>
            <div className="grid grid-cols-3 gap-4">
              {formControls
                .filter((controlItem) =>
                  [
                    "keywords",
                    "juzNumber",
                    "surahName",
                    "surahNumber",
                    "verseNumber",
                    "globalVerseNumber",
                  ]?.includes(controlItem.name)
                )
                .map((controlItem) => (
                  <div key={controlItem.name}>
                    <Label className="mb-1">{controlItem.label}</Label>
                    {renderInputsByComponentType(controlItem)}
                  </div>
                ))}
            </div>
          </div>

          {/* Verse Section */}
          <div className="p-6 bg-primary-foreground rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Verse</h2>
            <div className="grid grid-cols-2 gap-4">
              {formControls
                .filter((controlItem) =>
                  ["arabicText"].includes(controlItem.name)
                )
                .map((controlItem) => (
                  <div key={controlItem.name} className="col-span-2">
                    <Label className="mb-1">{controlItem.label}</Label>
                    {renderInputsByComponentType(controlItem)}
                  </div>
                ))}
            </div>
          </div>

          {/* translation  */}
          <div className="grid grid-cols-2 gap-4 bg-primary-foreground rounded-lg shadow-lg p-6">
            {["ban", "eng"].map((field, index) => (
              <div key={field} className="flex flex-col gap-1">
                <label className="...">Translations ({field})</label>
                <Textarea
                  rows={4}
                  name={`translations-${field}`}
                  className="w-full px-4 py-2 rounded-md border bg-adminInput outline-none focus:ring-2 focus:ring-primary"
                  placeholder={`Translations (${field})`}
                  value={formData.translations?.[index]?.[field] || ""}
                  onChange={(event) => {
                    // Ensure translations is an array
                    const updatedTranslations = [
                      ...(formData.translations || []),
                    ];

                    // Update the specific field in the array
                    updatedTranslations[index] = {
                      ...updatedTranslations[index],
                      [field]: event.target.value,
                    };

                    // Update the formData state
                    setFormData({
                      ...formData,
                      translations: updatedTranslations,
                    });
                  }}
                ></Textarea>
              </div>
            ))}
          </div>

          {/* transliteration */}
          <div className="grid grid-cols-2 gap-4 bg-primary-foreground rounded-lg shadow-lg p-6">
            {["ban", "eng"].map((field, index) => (
              <div key={field} className="flex flex-col gap-1">
                <label className="...">Transliteration ({field})</label>
                <Textarea
                  rows={4}
                  name={`transliteration-${field}`}
                  className="w-full px-4 py-2 rounded-md border bg-adminInput outline-none focus:ring-2 focus:ring-primary"
                  placeholder={`Transliteration (${field})`}
                  value={formData.transliteration?.[index]?.[field] || ""}
                  onChange={(event) => {
                    // Ensure translations is an array
                    const updatedTransliteration = [
                      ...(formData.transliteration || []),
                    ];

                    // Update the specific field in the array
                    updatedTransliteration[index] = {
                      ...updatedTransliteration[index],
                      [field]: event.target.value,
                    };

                    // Update the formData state
                    setFormData({
                      ...formData,
                      transliteration: updatedTransliteration,
                    });
                  }}
                ></Textarea>
              </div>
            ))}
          </div>

          {/* Buttons */}
          <div className="flex justify-end">
            <Button
              disabled={isBtnDisabled}
              type="submit"
              className={`px-4 py-2 ${allClasses.btnClass}`}
            >
              {isLoading ? (
                <div role="status">
                  <svg
                    aria-hidden="true"
                    className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-primary"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentFill"
                    />
                  </svg>
                  <span className="sr-only">Loading...</span>
                </div>
              ) : (
                buttonText || "Submit"
              )}
            </Button>
          </div>
        </div>
      ) : (
        // Default Layout
        <main>
          <div className={allClasses.formClass}>
            {formControls.map((controlItem) => (
              <div className="grid w-full gap-1.5" key={controlItem.name}>
                <Label className="mb-1">{controlItem.label}</Label>
                {renderInputsByComponentType(controlItem)}
              </div>
            ))}
          </div>
          <Button
            disabled={isBtnDisabled}
            type="submit"
            className={`px-4 py-2 ${allClasses.btnClass}`}
          >
            {isLoading ? (
              <div role="status">
                <svg
                  aria-hidden="true"
                  className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-primary"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                  />
                </svg>
                <span className="sr-only">Loading...</span>
              </div>
            ) : (
              buttonText || "Submit"
            )}
          </Button>
        </main>
      )}
    </form>
  );
}
