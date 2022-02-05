import { TabsContent } from "components/shared/TabList";
import { Button } from "components/Button";
import { FormField } from "components/form/FormField";
import { Toggle } from "components/form/Toggle";
import { useAuth } from "context/AuthContext";
import { Form, Formik } from "formik";
import useFetch from "lib/useFetch";
import { useTranslations } from "use-intl";
import { StatusViewMode } from "@snailycad/types";
import { Select } from "components/form/Select";

const LABELS = {
  [StatusViewMode.DOT_COLOR]: "Dot color",
  [StatusViewMode.FULL_ROW_COLOR]: "Full row color",
};

export function AppearanceTab() {
  const { user, setUser } = useAuth();
  const t = useTranslations("Account");
  const { execute, state } = useFetch();
  const common = useTranslations("Common");

  const INITIAL_VALUES = {
    isDarkTheme: user?.isDarkTheme ?? true,
    statusViewMode: user?.statusViewMode ?? StatusViewMode.DOT_COLOR,
  };

  async function onSubmit(data: typeof INITIAL_VALUES) {
    const { json } = await execute("/user", {
      method: "PATCH",
      data: { username: user?.username, ...data },
    });

    if (json.id) {
      setUser({ ...user, ...json });
    }
  }

  return (
    <TabsContent aria-label={t("appearanceSettings")} value="appearanceSettings">
      <h3 className="text-2xl font-semibold">{t("appearanceSettings")}</h3>
      <Formik onSubmit={onSubmit} initialValues={INITIAL_VALUES}>
        {({ handleChange, values, errors }) => (
          <Form className="mt-3">
            <FormField checkbox errorMessage={errors.isDarkTheme} label="Dark Theme">
              <Toggle toggled={values.isDarkTheme} onClick={handleChange} name="isDarkTheme" />
            </FormField>

            <FormField errorMessage={errors.statusViewMode} label="Status View">
              <Select
                values={Object.values(StatusViewMode).map((v) => ({
                  value: v,
                  label: LABELS[v],
                }))}
                value={values.statusViewMode}
                onChange={handleChange}
                name="statusViewMode"
              />
            </FormField>

            <Button type="submit" disabled={state === "loading"}>
              {common("save")}
            </Button>
          </Form>
        )}
      </Formik>
    </TabsContent>
  );
}
