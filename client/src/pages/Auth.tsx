import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Compass, Loader2, Camera } from 'lucide-react';
import { apiService } from '@/services/ApiService';
import { toast } from 'sonner';

const Auth = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [loginData, setLoginData] = useState({ email: '', password: '' });
    const [registerData, setRegisterData] = useState({ name: '', email: '', password: '' });
    const [profileImage, setProfileImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem('token')) {
            navigate('/');
        }
    }, [navigate]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await apiService.login(loginData);
            localStorage.setItem('token', response.token);
            toast.success('Welcome back!');
            navigate('/');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Login failed');
        } finally {
            setIsLoading(false);
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const formData = {
                ...registerData,
                profileImage: profileImage
            };
            const response = await apiService.register(formData);
            localStorage.setItem('token', response.token);
            toast.success('Account created successfully!');
            navigate('/');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Registration failed');
        } finally {
            setIsLoading(false);
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setProfileImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-muted/30 p-4">
            <div className="w-full max-w-[400px] space-y-8">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center shadow-lg">
                        <Compass className="w-7 h-7 text-primary-foreground" />
                    </div>
                    <div className="text-center">
                        <h1 className="text-2xl font-heading font-bold tracking-tight">TripAI</h1>
                        <p className="text-sm text-muted-foreground font-medium">Your personal AI travel assistant</p>
                    </div>
                </div>

                <Tabs defaultValue="login" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-4">
                        <TabsTrigger value="login">Login</TabsTrigger>
                        <TabsTrigger value="register">Register</TabsTrigger>
                    </TabsList>

                    <TabsContent value="login">
                        <Card className="border-none shadow-xl bg-card/50 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle>Login</CardTitle>
                                <CardDescription>Enter your credentials to access your trips</CardDescription>
                            </CardHeader>
                            <form onSubmit={handleLogin}>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="login-email">Email</Label>
                                        <Input
                                            id="login-email"
                                            type="email"
                                            placeholder="m@example.com"
                                            required
                                            value={loginData.email}
                                            onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="login-password">Password</Label>
                                        <Input
                                            id="login-password"
                                            type="password"
                                            required
                                            value={loginData.password}
                                            onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                                        />
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Button className="w-full gradient-primary" disabled={isLoading}>
                                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Sign In
                                    </Button>
                                </CardFooter>
                            </form>
                        </Card>
                    </TabsContent>

                    <TabsContent value="register">
                        <Card className="border-none shadow-xl bg-card/50 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle>Create Account</CardTitle>
                                <CardDescription>Join TripAI and start planning today</CardDescription>
                            </CardHeader>
                            <form onSubmit={handleRegister}>
                                <CardContent className="space-y-4">
                                    <div className="flex flex-col items-center gap-2 mb-4">
                                        <div className="relative group">
                                            <div className="w-20 h-20 rounded-full bg-muted border-2 border-dashed border-border flex items-center justify-center overflow-hidden">
                                                {imagePreview ? (
                                                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                                ) : (
                                                    <Camera className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
                                                )}
                                            </div>
                                            <Label
                                                htmlFor="profile-image"
                                                className="absolute inset-0 cursor-pointer opacity-0"
                                            >
                                                Upload
                                            </Label>
                                            <Input
                                                id="profile-image"
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={handleImageChange}
                                            />
                                        </div>
                                        <span className="text-xs text-muted-foreground">Profile Picture (Optional)</span>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="reg-name">Full Name</Label>
                                        <Input
                                            id="reg-name"
                                            required
                                            value={registerData.name}
                                            onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="reg-email">Email</Label>
                                        <Input
                                            id="reg-email"
                                            type="email"
                                            required
                                            value={registerData.email}
                                            onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="reg-password">Password</Label>
                                        <Input
                                            id="reg-password"
                                            type="password"
                                            required
                                            value={registerData.password}
                                            onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                                        />
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Button className="w-full gradient-primary" disabled={isLoading}>
                                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Get Started
                                    </Button>
                                </CardFooter>
                            </form>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};

export default Auth;
