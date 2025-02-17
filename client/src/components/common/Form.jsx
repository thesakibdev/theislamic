import { memo } from "react";
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

const CommonForm = memo(function CommonForm({
  layout,
  formControls,
  formData,
  setFormData,
  onSubmit,
  buttonText,
  isBtnDisabled,
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
              <SelectValue
                placeholder={getControlItem.label || getControlItem?.name}
              />
            </SelectTrigger>
            <SelectContent>
              {getControlItem.options && getControlItem.options.length > 0
                ? getControlItem.options.map((optionItem) => (
                    <SelectItem
                      className="capitalize"
                      key={optionItem.id}
                      value={optionItem.id || optionItem?.code}
                    >
                      {optionItem.label || optionItem?.name}
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
                  ["surahNumber", "surahName", "juzNumber"]?.includes(
                    controlItem.name
                  )
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
                  ["arabicAyah", "verseNumber", "totalVerseNumber"].includes(
                    controlItem.name
                  )
                )
                .map((controlItem) => (
                  <div key={controlItem.name} className="col-span-2">
                    <Label className="mb-1">{controlItem.label}</Label>
                    {renderInputsByComponentType(controlItem)}
                  </div>
                ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end">
            <Button
              disabled={isBtnDisabled}
              type="submit"
              className={`px-4 py-2 ${allClasses.btnClass}`}
            >
              {buttonText || "Submit"}
            </Button>
          </div>
        </div>
      ) : layout === 3 ? (
        // Layout 3 Design
        <div className="space-y-8 py-10">
          {/* Meta Data Section */}
          <div className="p-6 bg-primary-foreground rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Meta Data</h2>
            <div className="grid grid-cols-3 gap-4">
              {formControls
                .filter((controlItem) =>
                  ["surahNumber", "verseNumber", "language"]?.includes(
                    controlItem.name
                  )
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
                  [
                    "translation",
                    "transliteration",
                    "note",
                    "keywords",
                  ].includes(controlItem.name)
                )
                .map((controlItem) => (
                  <div key={controlItem.name} className="col-span-2">
                    <Label className="mb-1">{controlItem.label}</Label>
                    {renderInputsByComponentType(controlItem)}
                  </div>
                ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end">
            <Button
              disabled={isBtnDisabled}
              type="submit"
              className={`px-4 py-2 ${allClasses.btnClass}`}
            >
              {buttonText || "Submit"}
            </Button>
          </div>
        </div>
      ) : layout === 4 ? (
        // Layout 4 Design
        <div className="space-y-8 py-10">
          {/* Meta Data Section */}
          <div className="p-6 bg-primary-foreground rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Meta Data</h2>
            <div className="grid grid-cols-3 gap-4">
              {formControls
                .filter((controlItem) =>
                  [
                    "bookName",
                    "partName",
                    "partNumber",
                    "chapterName",
                    "chapterNumber",
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

          {/* Hadith Section */}
          <div className="p-6 bg-primary-foreground rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Hadith</h2>
            <div className="grid grid-cols-2 gap-4">
              {formControls
                .filter((controlItem) =>
                  [
                    "hadithNumber",
                    "internationalNumber",
                    "hadithArabic",
                    "referenceBook",
                    "similarities",
                    "narrator",
                    "translation",
                    "transliteration",
                    "note",
                  ].includes(controlItem.name)
                )
                .map((controlItem) => (
                  <div key={controlItem.name} className="col-span-2">
                    <Label className="mb-1">{controlItem.label}</Label>
                    {renderInputsByComponentType(controlItem)}
                  </div>
                ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end">
            <Button
              disabled={isBtnDisabled}
              type="submit"
              className={`px-4 py-2 ${allClasses.btnClass}`}
            >
              {buttonText || "Submit"}
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
            {buttonText || "Submit"}
          </Button>
        </main>
      )}
    </form>
  );
});

export default CommonForm;
