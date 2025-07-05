import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import Typography from "@mui/material/Typography";

interface ChangePaceProps {
  handleSliderChange: (event: Event, value: number | number[]) => void;
  handlePaceChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  pace: number;
}

export default function ChangePace({ handleSliderChange, handlePaceChange, pace }: ChangePaceProps) {
    return (
        <Box className="w-full" sx={{ width: '100%' }}>
            <Typography id="input-slider" gutterBottom className="text-sm sm:text-base">
                Pace: {pace} km/h
            </Typography>
            <Slider
                aria-label="Pace"
                value={pace}
                onChange={handleSliderChange}
                valueLabelDisplay="off"
                step={0.1}
                min={1}
                max={10}
                sx={{ 
                    width: '100%',
                    '& .MuiSlider-track': {
                        backgroundColor: 'hsl(var(--p))',
                    },
                    '& .MuiSlider-thumb': {
                        backgroundColor: 'hsl(var(--p))',
                    },
                    '& .MuiSlider-rail': {
                        backgroundColor: 'hsl(var(--bc) / 0.2)',
                    }
                }}
            />

            {/* Alternative pace selector */}
            <div className="mt-4">
                <label className="label">
                    <span className="label-text font-medium text-xs sm:text-sm">Quick Pace Selection</span>
                </label>
                <select 
                    className="select select-bordered w-full select-sm sm:select-md text-xs sm:text-sm" 
                    value={pace}
                    onChange={handlePaceChange}
                >
                    <option value={3}>Slow Walk (3 km/h)</option>
                    <option value={4}>Leisurely Walk (4 km/h)</option>
                    <option value={5}>Normal Walk (5 km/h)</option>
                    <option value={6}>Brisk Walk (6 km/h)</option>
                    <option value={7}>Fast Walk (7 km/h)</option>
                    <option value={8}>Power Walk (8 km/h)</option>
                </select>
            </div>
        </Box>
    );
}