
import "./Home.css"
import { useEffect, useRef, useState } from "react"

const ingredientSections = [
    {
        title: "Dairy & Eggs",
        ingredients: ["Butter", "Buttermilk", "Cream cheese", "Eggs", "Heavy cream", "Milk", "Sour cream", "Yogurt"],
    },
    {
        title: "Flour & Grains",
        ingredients: ["All-purpose flour", "Bread flour", "Cornmeal", "Oats", "Rolled oats", "Rye flour", "Whole wheat flour"],
    },
    {
        title: "Sugar & Sweeteners",
        ingredients: ["Brown sugar", "Coconut sugar", "Honey", "Maple syrup", "Powdered sugar", "White sugar"],
    },
    {
        title: "Leaveners & Thickeners",
        ingredients: ["Baking powder", "Baking soda", "Cornstarch", "Gelatin", "Yeast"],
    },
    {
        title: "Flavoring & Spices",
        ingredients: ["Cinnamon", "Cocoa powder", "Ginger", "Nutmeg", "Salt", "Vanilla extract"],
    },
    {
        title: "Mix-ins",
        ingredients: ["Chocolate chips", "Coconut flakes", "Pecans", "Raisins", "Sprinkles", "Walnuts"],
    },
    {
        title: "Fruits & Produce",
        ingredients: ["Apples", "Bananas", "Blueberries", "Carrots", "Lemons", "Oranges", "Pumpkin", "Strawberries"],
    },
    {
        title: "Fats & Oils",
        ingredients: ["Canola oil", "Coconut oil", "Olive oil", "Vegetable oil"],
    },
]

function IngredientSearch({ title, ingredients }: (typeof ingredientSections)[number]) {
    const [query, setQuery] = useState("")
    const [selectedIngredients, setSelectedIngredients] = useState<string[]>([])
    const [recentlyDeselected, setRecentlyDeselected] = useState<string[]>([])
    const removalTimers = useRef(new Map<string, number>())
    const searchTerm = query.trim().toLocaleLowerCase()
    const matches = searchTerm
        ? ingredients.filter((ingredient) => ingredient.toLocaleLowerCase().includes(searchTerm))
        : []
    const visibleIngredients = [...new Set([...matches, ...selectedIngredients, ...recentlyDeselected])]

    useEffect(() => () => {
        removalTimers.current.forEach((timer) => window.clearTimeout(timer))
    }, [])

    function updateSelection(ingredient: string, checked: boolean) {
        const existingTimer = removalTimers.current.get(ingredient)
        if (existingTimer !== undefined) {
            window.clearTimeout(existingTimer)
            removalTimers.current.delete(ingredient)
        }

        if (checked) {
            setSelectedIngredients((selected) =>
                selected.includes(ingredient) ? selected : [...selected, ingredient],
            )
            setRecentlyDeselected((recent) => recent.filter((item) => item !== ingredient))
            return
        }

        setSelectedIngredients((selected) => selected.filter((item) => item !== ingredient))
        setRecentlyDeselected((recent) => [...recent.filter((item) => item !== ingredient), ingredient])
        const timer = window.setTimeout(() => {
            setRecentlyDeselected((recent) => recent.filter((item) => item !== ingredient))
            removalTimers.current.delete(ingredient)
        }, 1000)
        removalTimers.current.set(ingredient, timer)
    }

    return (
        <section>
            <h2>{title}</h2>
            <input
                type="search"
                aria-label={`Search ${title}`}
                placeholder={`Search ${title.toLocaleLowerCase()}...`}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
            />
            {visibleIngredients.length > 0 && (
                <ul className="search-results" aria-live="polite">
                    {visibleIngredients.map((ingredient) => (
                        <li key={ingredient}>
                            <label className="ingredient-option">
                                <input
                                    type="checkbox"
                                    checked={selectedIngredients.includes(ingredient)}
                                    onChange={(event) => updateSelection(ingredient, event.target.checked)}
                                />
                                {ingredient}
                            </label>
                        </li>
                    ))}
                </ul>
            )}
            {searchTerm && matches.length === 0 && (
                <p className="search-empty" role="status">No matching ingredients.</p>
            )}
        </section>
    )
}

export function Home() {
    return (
        <main className="home">
            <h1>What's In Your Kitchen?</h1>

            <div className="grid-container">
                {ingredientSections.map((section) => (
                    <IngredientSearch key={section.title} {...section} />
                ))}
            </div>
            <a className="recipe-button" href="/results">See Your Recipes</a>
        </main>
    );
}